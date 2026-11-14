using Microsoft.EntityFrameworkCore;
using EasyHousingSolution.CartService.Domain.Entities;

namespace EasyHousingSolution.CartService.Infrastructure.Data;

public class CartDbContext : DbContext
{
    public CartDbContext(DbContextOptions<CartDbContext> options) : base(options) {}

    public DbSet<CartItem> CartItems => Set<CartItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // viii) Cart: CartId int identity primary key, BuyerId int foreign key not null, PropertyId int foreign key not null
        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.ToTable("Cart");
            entity.HasKey(e => e.CartId);
            entity.Property(e => e.BuyerId).IsRequired();
            entity.Property(e => e.PropertyId).IsRequired();
            entity.HasIndex(e => new { e.BuyerId, e.PropertyId }).IsUnique();

            // Seed sample bookmarked properties for testing
            entity.HasData(
                new CartItem
                {
                    CartId = 1,
                    BuyerId = 1,
                    PropertyId = 1
                },
                new CartItem
                {
                    CartId = 2,
                    BuyerId = 1,
                    PropertyId = 3
                }
            );
        });
    }
}
