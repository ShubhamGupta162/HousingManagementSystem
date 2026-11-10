using EasyHousingSolution.CartService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EasyHousingSolution.CartService.Infrastructure.Data;

public class CartDbContext : DbContext
{
    public CartDbContext(DbContextOptions<CartDbContext> options) : base(options)
    {
    }

    public DbSet<CartItem> CartItems => Set<CartItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasKey(e => e.CartId);
            entity.Property(e => e.BuyerId).IsRequired();
            entity.Property(e => e.PropertyId).IsRequired();
        });
    }
}
