using EasyHousingSolution.PropertyService.Domain.Entities;
using EasyHousingSolution.PropertyService.Domain.Interfaces;
using EasyHousingSolution.PropertyService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EasyHousingSolution.PropertyService.Infrastructure.Repositories;

public class PropertyRepository : IPropertyRepository
{
    private readonly PropertyDbContext _context;

    public PropertyRepository(PropertyDbContext context)
    {
        _context = context;
    }

    public async Task<Property?> GetByIdAsync(int id)
    {
        return await _context.Properties.FindAsync(id);
    }

    public async Task<IEnumerable<Property>> GetAllAsync()
    {
        return await _context.Properties.ToListAsync();
    }

    public async Task<Property> AddAsync(Property entity)
    {
        var entry = await _context.Properties.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entry.Entity;
    }

    public async Task UpdateAsync(Property entity)
    {
        _context.Properties.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Property entity)
    {
        _context.Properties.Remove(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteByIdAsync(int id)
    {
        var item = await GetByIdAsync(id);
        if (item != null)
        {
            await DeleteAsync(item);
        }
    }

    public async Task<IEnumerable<Property>> GetVerifiedPropertiesAsync()
    {
        return await _context.Properties
            .Where(p => p.IsActive)
            .OrderBy(p => p.PropertyName)
            .ToListAsync();
    }

    public async Task<IEnumerable<Property>> GetBySellerIdAsync(int sellerId, bool? isActive = null)
    {
        var query = _context.Properties.Where(p => p.SellerId == sellerId);
        if (isActive.HasValue)
        {
            query = query.Where(p => p.IsActive == isActive.Value);
        }
        return await query.ToListAsync();
    }

    public async Task<IEnumerable<Property>> SearchPropertiesAsync(int? cityId, string? propertyType, string? propertyOption, string? sortBy)
    {
        var query = _context.Properties.Where(p => p.IsActive);

        if (cityId.HasValue && cityId.Value > 0)
        {
            query = query.Where(p => p.CityId == cityId.Value);
        }

        if (!string.IsNullOrWhiteSpace(propertyType))
        {
            query = query.Where(p => p.PropertyType.ToLower() == propertyType.Trim().ToLower());
        }

        if (!string.IsNullOrWhiteSpace(propertyOption))
        {
            query = query.Where(p => p.PropertyOption.ToLower() == propertyOption.Trim().ToLower());
        }

        query = sortBy?.ToLowerInvariant() switch
        {
            "price" or "price_asc" => query.OrderBy(p => p.PriceRange),
            "price_desc" => query.OrderByDescending(p => p.PriceRange),
            _ => query.OrderBy(p => p.PropertyName)
        };

        return await query.ToListAsync();
    }
}

public class StateRepository : IStateRepository
{
    private readonly PropertyDbContext _context;

    public StateRepository(PropertyDbContext context)
    {
        _context = context;
    }

    public async Task<State?> GetByIdAsync(int id) => await _context.States.FindAsync(id);

    public async Task<IEnumerable<State>> GetAllAsync() => await _context.States.ToListAsync();

    public async Task<State> AddAsync(State entity)
    {
        var entry = await _context.States.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entry.Entity;
    }

    public async Task UpdateAsync(State entity)
    {
        _context.States.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(State entity)
    {
        _context.States.Remove(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteByIdAsync(int id)
    {
        var item = await GetByIdAsync(id);
        if (item != null) await DeleteAsync(item);
    }
}

public class CityRepository : ICityRepository
{
    private readonly PropertyDbContext _context;

    public CityRepository(PropertyDbContext context)
    {
        _context = context;
    }

    public async Task<City?> GetByIdAsync(int id) => await _context.Cities.FindAsync(id);

    public async Task<IEnumerable<City>> GetAllAsync() => await _context.Cities.ToListAsync();

    public async Task<IEnumerable<City>> GetCitiesByStateIdAsync(int stateId)
    {
        return await _context.Cities.Where(c => c.StateId == stateId).ToListAsync();
    }

    public async Task<City> AddAsync(City entity)
    {
        var entry = await _context.Cities.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entry.Entity;
    }

    public async Task UpdateAsync(City entity)
    {
        _context.Cities.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(City entity)
    {
        _context.Cities.Remove(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteByIdAsync(int id)
    {
        var item = await GetByIdAsync(id);
        if (item != null) await DeleteAsync(item);
    }
}

public class PropertyImageRepository : IPropertyImageRepository
{
    private readonly PropertyDbContext _context;

    public PropertyImageRepository(PropertyDbContext context)
    {
        _context = context;
    }

    public async Task<PropertyImage?> GetByIdAsync(int id) => await _context.PropertyImages.FindAsync(id);

    public async Task<IEnumerable<PropertyImage>> GetAllAsync() => await _context.PropertyImages.ToListAsync();

    public async Task<IEnumerable<PropertyImage>> GetImagesByPropertyIdAsync(int propertyId)
    {
        return await _context.PropertyImages.Where(i => i.PropertyId == propertyId).ToListAsync();
    }

    public async Task<int> GetImageCountByPropertyIdAsync(int propertyId)
    {
        return await _context.PropertyImages.CountAsync(i => i.PropertyId == propertyId);
    }

    public async Task<PropertyImage> AddAsync(PropertyImage entity)
    {
        var entry = await _context.PropertyImages.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entry.Entity;
    }

    public async Task UpdateAsync(PropertyImage entity)
    {
        _context.PropertyImages.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(PropertyImage entity)
    {
        _context.PropertyImages.Remove(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteByIdAsync(int id)
    {
        var item = await GetByIdAsync(id);
        if (item != null) await DeleteAsync(item);
    }
}
