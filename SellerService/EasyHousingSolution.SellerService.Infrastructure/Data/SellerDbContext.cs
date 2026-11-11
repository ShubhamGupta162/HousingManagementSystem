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

            // Seed Seller profiles
            entity.HasData(
                new Seller
                {
                    SellerId = 1,
                    UserId = 4,
                    FullName = "Amit Patel",
                    EmailId = "seller@demo.com",
                    PhoneNo = "9845012345",
                    Address = "123 MG Road, Bengaluru",
                    StateId = 2,
                    CityId = 3
                },
                new Seller
                {
                    SellerId = 2,
                    UserId = 5,
                    FullName = "Ananya Deshmukh",
                    EmailId = "ananya.d@estates.in",
                    PhoneNo = "9820054321",
                    Address = "45 Worli Sea Face, Mumbai",
                    StateId = 1,
                    CityId = 1
                },
                new Seller
                {
                    SellerId = 3,
                    UserId = 6,
                    FullName = "Vikram Singhania",
                    EmailId = "vikram.s@realty.com",
                    PhoneNo = "9811198765",
                    Address = "78 Jubilee Hills, Hyderabad",
                    StateId = 4,
                    CityId = 6
                }
            );
        });
    }
}
