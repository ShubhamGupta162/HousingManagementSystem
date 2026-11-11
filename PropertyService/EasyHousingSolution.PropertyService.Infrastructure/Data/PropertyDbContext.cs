using EasyHousingSolution.PropertyService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EasyHousingSolution.PropertyService.Infrastructure.Data;

public class PropertyDbContext : DbContext
{
    public PropertyDbContext(DbContextOptions<PropertyDbContext> options) : base(options)
    {
    }

    public DbSet<Property> Properties => Set<Property>();
    public DbSet<PropertyImage> PropertyImages => Set<PropertyImage>();
    public DbSet<State> States => Set<State>();
    public DbSet<City> Cities => Set<City>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // State
        modelBuilder.Entity<State>(entity =>
        {
            entity.HasKey(e => e.StateId);
            entity.Property(e => e.StateName).HasMaxLength(30).IsRequired();

            entity.HasData(
                new State { StateId = 1, StateName = "Maharashtra" },
                new State { StateId = 2, StateName = "Karnataka" },
                new State { StateId = 3, StateName = "Delhi NCR" },
                new State { StateId = 4, StateName = "Telangana" }
            );
        });

        // City
        modelBuilder.Entity<City>(entity =>
        {
            entity.HasKey(e => e.CityId);
            entity.Property(e => e.CityName).HasMaxLength(50).IsRequired();

            entity.HasData(
                new City { CityId = 1, CityName = "Mumbai", StateId = 1 },
                new City { CityId = 2, CityName = "Pune", StateId = 1 },
                new City { CityId = 3, CityName = "Bengaluru", StateId = 2 },
                new City { CityId = 4, CityName = "New Delhi", StateId = 3 },
                new City { CityId = 5, CityName = "Gurgaon", StateId = 3 },
                new City { CityId = 6, CityName = "Hyderabad", StateId = 4 }
            );
        });

        // Property
        modelBuilder.Entity<Property>(entity =>
        {
            entity.HasKey(e => e.PropertyId);
            entity.Property(e => e.PropertyName).HasMaxLength(50).IsRequired();
            entity.Property(e => e.PropertyType).HasMaxLength(15).IsRequired();
            entity.Property(e => e.PropertyOption).HasMaxLength(10).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(250);
            entity.Property(e => e.Address).HasMaxLength(250).IsRequired();
            entity.Property(e => e.PriceRange).HasColumnType("decimal(18,2)").IsRequired();
            entity.Property(e => e.InitialDeposit).HasColumnType("decimal(18,2)").IsRequired();
            entity.Property(e => e.Landmark).HasMaxLength(25).IsRequired();
            entity.Property(e => e.DeactivationReason).HasMaxLength(250);

            entity.HasData(
                new Property
                {
                    PropertyId = 1,
                    PropertyName = "Sobha Dream Acres 3BHK",
                    PropertyType = "Apartment",
                    PropertyOption = "Sell",
                    Description = "Modern luxury 3BHK flat with Italian kitchen, wooden flooring, and clubhouse.",
                    Address = "Tower 4, Panathur Road",
                    PriceRange = 8500000m,
                    InitialDeposit = 0m,
                    Landmark = "Outer Ring Road",
                    IsActive = true,
                    CityId = 3,
                    SellerId = 1
                },
                new Property
                {
                    PropertyId = 2,
                    PropertyName = "Prestige Silver Oak Villa",
                    PropertyType = "Villa",
                    PropertyOption = "Sell",
                    Description = "Gated triplex villa with private lawn, home theater room, and solar heating.",
                    Address = "Villa 18, ECC Road",
                    PriceRange = 22000000m,
                    InitialDeposit = 0m,
                    Landmark = "Hope Farm",
                    IsActive = true,
                    CityId = 3,
                    SellerId = 1
                },
                new Property
                {
                    PropertyId = 3,
                    PropertyName = "Hiranandani Lakeview 2BHK",
                    PropertyType = "Apartment",
                    PropertyOption = "Rent",
                    Description = "Semi-furnished elegant 2BHK with lake view, granite tops, split ACs, and piped gas.",
                    Address = "Castle Rock, Central Ave",
                    PriceRange = 55000m,
                    InitialDeposit = 150000m,
                    Landmark = "Powai Lake",
                    IsActive = true,
                    CityId = 1,
                    SellerId = 2
                },
                new Property
                {
                    PropertyId = 4,
                    PropertyName = "DLF Cyber City Tech Suite",
                    PropertyType = "Commercial",
                    PropertyOption = "Rent",
                    Description = "Plug-and-play office with 40 workstations, 2 conference rooms, and 100% backup.",
                    Address = "Building 10, DLF Phase 2",
                    PriceRange = 135000m,
                    InitialDeposit = 400000m,
                    Landmark = "Cyber City Metro",
                    IsActive = true,
                    CityId = 5,
                    SellerId = 1
                },
                new Property
                {
                    PropertyId = 5,
                    PropertyName = "Lodha Park Sky Residence 4BHK",
                    PropertyType = "Apartment",
                    PropertyOption = "Sell",
                    Description = "Ultra-luxurious high-rise with Arabian Sea view and 7-tier security.",
                    Address = "Park Tower, Worli Marg",
                    PriceRange = 37500000m,
                    InitialDeposit = 0m,
                    Landmark = "Worli Sea Face",
                    IsActive = true,
                    CityId = 1,
                    SellerId = 2
                },
                new Property
                {
                    PropertyId = 6,
                    PropertyName = "My Home Bhooja Elite Villa",
                    PropertyType = "Villa",
                    PropertyOption = "Sell",
                    Description = "Contemporary architectural villa with elevator, pool, and smart home fixtures.",
                    Address = "Silpa Gram Road",
                    PriceRange = 19500000m,
                    InitialDeposit = 0m,
                    Landmark = "Cyber Towers",
                    IsActive = true,
                    CityId = 6,
                    SellerId = 3
                },
                new Property
                {
                    PropertyId = 7,
                    PropertyName = "Godrej Woods Green Valley 3BHK",
                    PropertyType = "Apartment",
                    PropertyOption = "Rent",
                    Description = "Forest-themed residence surrounded by 600 trees, infinity pool, and squash court.",
                    Address = "Sector 43, Expressway",
                    PriceRange = 38000m,
                    InitialDeposit = 76000m,
                    Landmark = "Golf Course Metro",
                    IsActive = true,
                    CityId = 4,
                    SellerId = 2
                },
                // Unverified property for Admin verification testing
                new Property
                {
                    PropertyId = 8,
                    PropertyName = "Green Meadows Residential Plot",
                    PropertyType = "Plot",
                    PropertyOption = "Sell",
                    Description = "Approved residential villa plot with clear title, borewell water, and wide roads.",
                    Address = "Plot 42, Devanahalli",
                    PriceRange = 4500000m,
                    InitialDeposit = 0m,
                    Landmark = "Near Airport Road",
                    IsActive = false,
                    CityId = 3,
                    SellerId = 1
                },
                // Deactivated property with reason for review testing
                new Property
                {
                    PropertyId = 9,
                    PropertyName = "Sunrise Towers 1BHK",
                    PropertyType = "Apartment",
                    PropertyOption = "Rent",
                    Description = "Studio 1BHK close to airport and tech parks.",
                    Address = "Flat 204, Viman Nagar",
                    PriceRange = 22000m,
                    InitialDeposit = 50000m,
                    Landmark = "Near Phoenix Mall",
                    IsActive = false,
                    DeactivationReason = "Incomplete property ownership documentation submitted by seller.",
                    CityId = 2,
                    SellerId = 2
                }
            );
        });

        // PropertyImage
        modelBuilder.Entity<PropertyImage>(entity =>
        {
            entity.HasKey(e => e.ImageId);
            entity.Property(e => e.ImageData).IsRequired();

            entity.HasData(
                new PropertyImage
                {
                    ImageId = 1,
                    PropertyId = 1,
                    ImageData = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'><rect width='400' height='250' fill='%2305203c'/><text x='50%' y='50%' font-size='20' fill='%23ffffff' text-anchor='middle'>Sobha Dream Acres Exterior</text></svg>"
                },
                new PropertyImage
                {
                    ImageId = 2,
                    PropertyId = 2,
                    ImageData = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'><rect width='400' height='250' fill='%23008cff'/><text x='50%' y='50%' font-size='20' fill='%23ffffff' text-anchor='middle'>Prestige Villa Garden</text></svg>"
                },
                new PropertyImage
                {
                    ImageId = 3,
                    PropertyId = 3,
                    ImageData = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'><rect width='400' height='250' fill='%2310b981'/><text x='50%' y='50%' font-size='20' fill='%23ffffff' text-anchor='middle'>Hiranandani Lake View</text></svg>"
                }
            );
        });
    }
}
