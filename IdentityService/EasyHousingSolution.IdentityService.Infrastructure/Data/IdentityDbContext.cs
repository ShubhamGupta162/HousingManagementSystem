using EasyHousingSolution.IdentityService.Domain.Entities;
using EasyHousingSolution.Shared.Security;
using Microsoft.EntityFrameworkCore;

namespace EasyHousingSolution.IdentityService.Infrastructure.Data;

public class IdentityDbContext : DbContext
{
    public IdentityDbContext(DbContextOptions<IdentityDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Buyer> Buyers => Set<Buyer>();
    public DbSet<Seller> Sellers => Set<Seller>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserName);
            entity.Property(e => e.UserName).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Password).HasMaxLength(250).IsRequired();
            entity.Property(e => e.UserType).HasMaxLength(15).IsRequired();

            // Seed default Admin
            entity.HasData(new User
            {
                UserName = "admin@easysolution.com",
                Password = PasswordSecurity.HashPassword("Admin@123"),
                UserType = "Admin"
            });
        });

        // Buyer
        modelBuilder.Entity<Buyer>(entity =>
        {
            entity.HasKey(e => e.BuyerId);
            entity.Property(e => e.EmailId).HasMaxLength(50).IsRequired();
            entity.Property(e => e.FullName).HasMaxLength(50).IsRequired();
            entity.Property(e => e.PhoneNo).HasMaxLength(10).IsRequired();
        });

        // Seller
        modelBuilder.Entity<Seller>(entity =>
        {
            entity.HasKey(e => e.SellerId);
            entity.Property(e => e.EmailId).HasMaxLength(50).IsRequired();
            entity.Property(e => e.FullName).HasMaxLength(50).IsRequired();
            entity.Property(e => e.PhoneNo).HasMaxLength(10).IsRequired();
            entity.Property(e => e.Address).HasMaxLength(250).IsRequired();
        });
    }
}
