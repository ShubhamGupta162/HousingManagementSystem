using Microsoft.EntityFrameworkCore;
using EasyHousingSolution.UserService.Domain.Entities;

namespace EasyHousingSolution.UserService.Infrastructure.Data;

public class UserDbContext : DbContext
{
    public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) {}

    public DbSet<Buyer> Buyers => Set<Buyer>();
    public DbSet<Seller> Sellers => Set<Seller>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // v) Buyer: BuyerId int identity primary key, FirstName varchar(25) not null, LastName varchar(25), DateOfBirth date not null, PhoneNo varchar(10) not null, EmailId varchar(50) not null
        modelBuilder.Entity<Buyer>(entity =>
        {
            entity.ToTable("Buyer");
            entity.HasKey(e => e.BuyerId);
            entity.HasIndex(e => e.EmailId).IsUnique();
            entity.Property(e => e.FirstName).HasColumnType("varchar(25)").HasMaxLength(25).IsRequired();
            entity.Property(e => e.LastName).HasColumnType("varchar(25)").HasMaxLength(25);
            entity.Property(e => e.DateOfBirth).HasColumnType("date").IsRequired();
            entity.Property(e => e.PhoneNo).HasColumnType("varchar(10)").HasMaxLength(10).IsRequired();
            entity.Property(e => e.EmailId).HasColumnType("varchar(50)").HasMaxLength(50).IsRequired();
            entity.Ignore(e => e.UserName);

            entity.HasData(
                new Buyer
                {
                    BuyerId = 1,
                    FirstName = "Rajesh",
                    LastName = "Sharma",
                    DateOfBirth = new DateTime(1990, 5, 15),
                    PhoneNo = "9876543210",
                    EmailId = "buyer@demo.com"
                },
                new Buyer
                {
                    BuyerId = 2,
                    FirstName = "Priya",
                    LastName = "Nair",
                    DateOfBirth = new DateTime(1994, 8, 22),
                    PhoneNo = "9820067890",
                    EmailId = "priya.nair@outlook.com"
                }
            );
        });

        // ii) Seller: SellerId int identity primary key, UserName varchar(25) not null, FirstName varchar(25) not null, LastName varchar(25), DateofBirth date not null, PhoneNo varchar(10) not null, Address varchar(250) not null, StateId int foreign key not null, CityId int foreign key not null, EmailId varchar(50) not null
        modelBuilder.Entity<Seller>(entity =>
        {
            entity.ToTable("Seller");
            entity.HasKey(e => e.SellerId);
            entity.HasIndex(e => e.EmailId).IsUnique();
            entity.Property(e => e.UserName).HasColumnType("varchar(25)").HasMaxLength(25).IsRequired();
            entity.Property(e => e.FirstName).HasColumnType("varchar(25)").HasMaxLength(25).IsRequired();
            entity.Property(e => e.LastName).HasColumnType("varchar(25)").HasMaxLength(25);
            entity.Property(e => e.DateofBirth).HasColumnType("date").IsRequired();
            entity.Property(e => e.PhoneNo).HasColumnType("varchar(10)").HasMaxLength(10).IsRequired();
            entity.Property(e => e.Address).HasColumnType("varchar(250)").HasMaxLength(250).IsRequired();
            entity.Property(e => e.StateId).IsRequired();
            entity.Property(e => e.CityId).IsRequired();
            entity.Property(e => e.EmailId).HasColumnType("varchar(50)").HasMaxLength(50).IsRequired();

            entity.HasData(
                new Seller
                {
                    SellerId = 1,
                    UserName = "seller@demo.com",
                    FirstName = "Amit",
                    LastName = "Patel",
                    DateofBirth = new DateTime(1985, 3, 10),
                    PhoneNo = "9845012345",
                    Address = "123 MG Road, Bengaluru",
                    StateId = 2,
                    CityId = 3,
                    EmailId = "seller@demo.com"
                },
                new Seller
                {
                    SellerId = 2,
                    UserName = "ananya.d@estates.in",
                    FirstName = "Ananya",
                    LastName = "Deshmukh",
                    DateofBirth = new DateTime(1988, 11, 4),
                    PhoneNo = "9820054321",
                    Address = "45 Worli Sea Face, Mumbai",
                    StateId = 1,
                    CityId = 1,
                    EmailId = "ananya.d@estates.in"
                },
                new Seller
                {
                    SellerId = 3,
                    UserName = "vikram.s@realty.com",
                    FirstName = "Vikram",
                    LastName = "Singhania",
                    DateofBirth = new DateTime(1982, 7, 19),
                    PhoneNo = "9811198765",
                    Address = "78 Jubilee Hills, Hyderabad",
                    StateId = 4,
                    CityId = 6,
                    EmailId = "vikram.s@realty.com"
                }
            );
        });
    }
}
