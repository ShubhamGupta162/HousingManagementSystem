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
        });

        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasKey(e => e.CartId);
            entity.HasIndex(e => new { e.BuyerId, e.PropertyId }).IsUnique();
        });
    }
}
