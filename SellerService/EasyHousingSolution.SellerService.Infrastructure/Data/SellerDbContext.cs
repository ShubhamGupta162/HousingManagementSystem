using Microsoft.EntityFrameworkCore;
using EasyHousingSolution.SellerService.Domain.Entities;

namespace EasyHousingSolution.SellerService.Infrastructure.Data;

public class SellerDbContext : DbContext
{
    public SellerDbContext(DbContextOptions<SellerDbContext> options) : base(options) {}

    public DbSet<Seller> Sellers => Set<Seller>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Seller>(entity =>
        {
            entity.HasKey(e => e.SellerId);
            entity.HasIndex(e => e.EmailId).IsUnique();
            entity.Property(e => e.FullName).IsRequired().HasMaxLength(50);
            entity.Property(e => e.EmailId).IsRequired().HasMaxLength(50);
            entity.Property(e => e.PhoneNo).IsRequired().HasMaxLength(10);
            entity.Property(e => e.Address).IsRequired().HasMaxLength(250);
        });
    }
}
