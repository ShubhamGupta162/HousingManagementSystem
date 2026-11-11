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
            entity.Property(e => e.FullName).HasMaxLength(50);
            entity.Property(e => e.PhoneNo).HasMaxLength(10);

            // Seed default Admin
            entity.HasData(new User
            {
                UserName = "admin@easysolution.com",
                Password = PasswordSecurity.HashPassword("Admin@123"),
                UserType = "Admin",
                FullName = "System Administrator",
                PhoneNo = "9999999999"
            });
        });
    }
}
