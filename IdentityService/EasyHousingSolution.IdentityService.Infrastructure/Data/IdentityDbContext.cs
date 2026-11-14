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

        // i) Users table: UserName varchar(25) primary key, Password varchar(25) not null, UserType varchar(15)
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(e => e.UserName);
            entity.Property(e => e.UserName).HasColumnType("varchar(25)").HasMaxLength(25).IsRequired();
            entity.Property(e => e.Password).HasColumnType("varchar(25)").HasMaxLength(25).IsRequired();
            entity.Property(e => e.UserType).HasColumnType("varchar(15)").HasMaxLength(15).IsRequired();

            // Ignore non-database helper properties
            entity.Ignore(e => e.FullName);
            entity.Ignore(e => e.PhoneNo);
            entity.Ignore(e => e.ProfileId);

            // Seed Admin, Buyers, and Sellers (Password fits within varchar(25))
            entity.HasData(
                new User
                {
                    UserName = "admin@easysolution.com",
                    Password = "AdminPassword123!",
                    UserType = "Admin"
                },
                new User
                {
                    UserName = "buyer@demo.com",
                    Password = "BuyerPassword123!",
                    UserType = "Buyer"
                },
                new User
                {
                    UserName = "priya.nair@outlook.com",
                    Password = "BuyerPassword123!",
                    UserType = "Buyer"
                },
                new User
                {
                    UserName = "seller@demo.com",
                    Password = "SellerPassword123!",
                    UserType = "Seller"
                },
                new User
                {
                    UserName = "ananya.d@estates.in",
                    Password = "SellerPassword123!",
                    UserType = "Seller"
                },
                new User
                {
                    UserName = "vikram.s@realty.com",
                    Password = "SellerPassword123!",
                    UserType = "Seller"
                }
            );
        });
    }
}
