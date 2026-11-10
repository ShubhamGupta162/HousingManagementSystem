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
                new State { StateId = 3, StateName = "Delhi" }
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
                new City { CityId = 4, CityName = "New Delhi", StateId = 3 }
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
        });

        // PropertyImage
        modelBuilder.Entity<PropertyImage>(entity =>
        {
            entity.HasKey(e => e.ImageId);
            entity.Property(e => e.ImageData).IsRequired();
        });
    }
}
