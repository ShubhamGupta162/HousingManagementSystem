using EasyHousingSolution.PropertyService.Domain.Entities;
using EasyHousingSolution.Shared.Common;

namespace EasyHousingSolution.PropertyService.Domain.Interfaces;

public interface IPropertyRepository : IRepository<Property>
{
    Task<IEnumerable<Property>> GetVerifiedPropertiesAsync();
    Task<IEnumerable<Property>> GetBySellerIdAsync(int sellerId, bool? isActive = null);
    Task<IEnumerable<Property>> SearchPropertiesAsync(int? cityId, string? propertyType, string? propertyOption, string? sortBy);
}

public interface IStateRepository : IRepository<State>
{
}

public interface ICityRepository : IRepository<City>
{
    Task<IEnumerable<City>> GetCitiesByStateIdAsync(int stateId);
}

public interface IPropertyImageRepository : IRepository<PropertyImage>
{
    Task<IEnumerable<PropertyImage>> GetImagesByPropertyIdAsync(int propertyId);
    Task<int> GetImageCountByPropertyIdAsync(int propertyId);
}
