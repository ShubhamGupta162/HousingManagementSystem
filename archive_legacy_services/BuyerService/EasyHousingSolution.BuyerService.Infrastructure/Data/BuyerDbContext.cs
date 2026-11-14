using Microsoft.EntityFrameworkCore;
using EasyHousingSolution.BuyerService.Domain.Entities;

namespace EasyHousingSolution.BuyerService.Infrastructure.Data;

public class BuyerDbContext : DbContext
{
    public BuyerDbContext(DbContextOptions<BuyerDbContext> options) : base(options) {}

    public DbSet<Buyer> Buyers => Set<Buyer>();
    public DbSet<CartItem> CartItems => Set<CartItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Buyer>(entity =>
        {
            entity.HasKey(e => e.BuyerId);
            entity.HasIndex(e => e.EmailId).IsUnique();
            entity.Property(e => e.FullName).IsRequired().HasMaxLength(50);
            entity.Property(e => e.EmailId).IsRequired().HasMaxLength(50);
            entity.Property(e => e.PhoneNo).IsRequired().HasMaxLength(10);

            // Seed Buyer profiles
            entity.HasData(
                new Buyer
                {
                    BuyerId = 1,
                    UserId = 2,
                    FullName = "Rajesh Sharma",
                    EmailId = "buyer@demo.com",
                    PhoneNo = "9876543210"
                },
                new Buyer
                {
                    BuyerId = 2,
                    UserId = 3,
                    FullName = "Priya Nair",
                    EmailId = "priya.nair@outlook.com",
                    PhoneNo = "9820067890"
                }
            );
        });

        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasKey(e => e.CartId);
            entity.HasIndex(e => new { e.BuyerId, e.PropertyId }).IsUnique();

            // Seed bookmarked cart items for Buyer 1
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
