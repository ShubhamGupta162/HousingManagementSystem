using EasyHousingSolution.PropertyService.Application.DTOs;

namespace EasyHousingSolution.PropertyService.Application.Interfaces;

public interface IPropertyAppService
{
    Task<PropertyResponseDto> CreatePropertyAsync(CreatePropertyDto dto);
    Task<PropertyResponseDto> UpdatePropertyAsync(int id, UpdatePropertyDto dto);
    Task<PropertyResponseDto?> GetPropertyByIdAsync(int id);
    Task<IEnumerable<PropertyResponseDto>> GetAllPropertiesAsync();
    Task<IEnumerable<PropertyResponseDto>> GetVerifiedPropertiesAsync();
    Task<IEnumerable<PropertyResponseDto>> GetPropertiesBySellerAsync(int sellerId, bool? isActive = null);
    Task<IEnumerable<PropertyResponseDto>> SearchPropertiesAsync(int? cityId, string? propertyType, string? propertyOption, string? sortBy);
    Task<PropertyResponseDto> VerifyPropertyAsync(int id);
    Task<PropertyResponseDto> DeactivatePropertyAsync(int id, string reason);
    Task<PropertyResponseDto> BuyPropertyAsync(int id, int buyerId);
    Task<IEnumerable<PropertyResponseDto>> GetPurchasedPropertiesByBuyerIdAsync(int buyerId);
    Task<IEnumerable<PropertyResponseDto>> GetSoldPropertiesBySellerIdAsync(int sellerId);
    Task<AdminSalesReportDto> GetSalesReportAsync();
    Task DeletePropertyAsync(int id);
}

public interface ILocationAppService
{
    Task<IEnumerable<StateDto>> GetAllStatesAsync();
    Task<StateDto> CreateStateAsync(StateDto dto);
    Task<IEnumerable<CityDto>> GetAllCitiesAsync();
    Task<IEnumerable<CityDto>> GetCitiesByStateIdAsync(int stateId);
    Task<CityDto> CreateCityAsync(CityDto dto);
}

public interface IImageAppService
{
    Task<IEnumerable<PropertyImageDto>> GetImagesByPropertyIdAsync(int propertyId);
    Task<IEnumerable<PropertyImageDto>> UploadImagesAsync(int propertyId, List<string> images);
}
