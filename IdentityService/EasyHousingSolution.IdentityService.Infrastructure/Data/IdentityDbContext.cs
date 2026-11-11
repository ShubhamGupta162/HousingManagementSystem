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

            // Seed Admin, Buyers, and Sellers for testing all roles
            entity.HasData(
                new User
                {
                    UserName = "admin@easysolution.com",
                    Password = PasswordSecurity.HashPassword("AdminPassword123!"),
                    UserType = "Admin",
                    FullName = "System Administrator",
                    PhoneNo = "9999999999",
                    ProfileId = 1
                },
                new User
                {
                    UserName = "buyer@demo.com",
                    Password = PasswordSecurity.HashPassword("BuyerPassword123!"),
                    UserType = "Buyer",
                    FullName = "Rajesh Sharma",
                    PhoneNo = "9876543210",
                    ProfileId = 1
                },
                new User
                {
                    UserName = "priya.nair@outlook.com",
                    Password = PasswordSecurity.HashPassword("BuyerPassword123!"),
                    UserType = "Buyer",
                    FullName = "Priya Nair",
                    PhoneNo = "9820067890",
                    ProfileId = 2
                },
                new User
                {
                    UserName = "seller@demo.com",
                    Password = PasswordSecurity.HashPassword("SellerPassword123!"),
                    UserType = "Seller",
                    FullName = "Amit Patel",
                    PhoneNo = "9845012345",
                    ProfileId = 1
                },
                new User
                {
                    UserName = "ananya.d@estates.in",
                    Password = PasswordSecurity.HashPassword("SellerPassword123!"),
                    UserType = "Seller",
                    FullName = "Ananya Deshmukh",
                    PhoneNo = "9820054321",
                    ProfileId = 2
                },
                new User
                {
                    UserName = "vikram.s@realty.com",
                    Password = PasswordSecurity.HashPassword("SellerPassword123!"),
                    UserType = "Seller",
                    FullName = "Vikram Singhania",
                    PhoneNo = "9811198765",
                    ProfileId = 3
                }
            );
        });
    }
}
