using EasyHousingSolution.PropertyService.Application.DTOs;
using EasyHousingSolution.PropertyService.Application.Interfaces;
using EasyHousingSolution.PropertyService.Domain.Entities;
using EasyHousingSolution.PropertyService.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace EasyHousingSolution.PropertyService.Application.Services;

public class PropertyAppService : IPropertyAppService
{
    private readonly IPropertyRepository _propertyRepository;
    private readonly ILogger<PropertyAppService> _logger;

    public PropertyAppService(IPropertyRepository propertyRepository, ILogger<PropertyAppService> logger)
    {
        _propertyRepository = propertyRepository;
        _logger = logger;
    }

    public async Task<PropertyResponseDto> CreatePropertyAsync(CreatePropertyDto dto)
    {
        _logger.LogInformation("Creating property '{PropertyName}' for SellerId {SellerId}", dto.PropertyName, dto.SellerId);
        if (string.IsNullOrWhiteSpace(dto.PropertyName))
            throw new ArgumentException("Property name is required.");

        var property = new Property
        {
            PropertyName = dto.PropertyName.Trim(),
            PropertyType = dto.PropertyType.Trim(),
            PropertyOption = dto.PropertyOption.Trim(),
            Description = dto.Description?.Trim(),
            Address = dto.Address.Trim(),
            PriceRange = dto.PriceRange,
            InitialDeposit = dto.PropertyOption.Equals("Rent", StringComparison.OrdinalIgnoreCase) ? dto.InitialDeposit : 0,
            Landmark = dto.Landmark.Trim(),
            IsActive = false, // Pending admin verification
            SellerId = dto.SellerId,
            CityId = dto.CityId
        };

        var created = await _propertyRepository.AddAsync(property);
        return MapToDto(created);
    }

    public async Task<PropertyResponseDto> UpdatePropertyAsync(int id, UpdatePropertyDto dto)
    {
        var existing = await _propertyRepository.GetByIdAsync(id);
        if (existing == null)
            throw new KeyNotFoundException($"Property with ID {id} not found.");

        existing.PropertyName = dto.PropertyName.Trim();
        existing.PropertyType = dto.PropertyType.Trim();
        existing.PropertyOption = dto.PropertyOption.Trim();
        existing.Description = dto.Description?.Trim();
        existing.Address = dto.Address.Trim();
        existing.PriceRange = dto.PriceRange;
        existing.InitialDeposit = dto.PropertyOption.Equals("Rent", StringComparison.OrdinalIgnoreCase) ? dto.InitialDeposit : 0;
        existing.Landmark = dto.Landmark.Trim();
        existing.CityId = dto.CityId;

        await _propertyRepository.UpdateAsync(existing);
        return MapToDto(existing);
    }

    public async Task<PropertyResponseDto?> GetPropertyByIdAsync(int id)
    {
        var property = await _propertyRepository.GetByIdAsync(id);
        return property == null ? null : MapToDto(property);
    }

    public async Task<IEnumerable<PropertyResponseDto>> GetAllPropertiesAsync()
    {
        var list = await _propertyRepository.GetAllAsync();
        return list.Select(MapToDto);
    }

    public async Task<IEnumerable<PropertyResponseDto>> GetVerifiedPropertiesAsync()
    {
        var list = await _propertyRepository.GetVerifiedPropertiesAsync();
        return list.Select(MapToDto);
    }

    public async Task<IEnumerable<PropertyResponseDto>> GetPropertiesBySellerAsync(int sellerId, bool? isActive = null)
    {
        var list = await _propertyRepository.GetBySellerIdAsync(sellerId, isActive);
        return list.Select(MapToDto);
    }

    public async Task<IEnumerable<PropertyResponseDto>> SearchPropertiesAsync(int? cityId, string? propertyType, string? propertyOption, string? sortBy)
    {
        var list = await _propertyRepository.SearchPropertiesAsync(cityId, propertyType, propertyOption, sortBy);
        return list.Select(MapToDto);
    }

    public async Task<PropertyResponseDto> VerifyPropertyAsync(int id)
    {
        var property = await _propertyRepository.GetByIdAsync(id);
        if (property == null)
            throw new KeyNotFoundException($"Property with ID {id} not found.");

        property.IsActive = true;
        property.DeactivationReason = null;

        await _propertyRepository.UpdateAsync(property);
        return MapToDto(property);
    }

    public async Task<PropertyResponseDto> DeactivatePropertyAsync(int id, string reason)
    {
        if (string.IsNullOrWhiteSpace(reason))
            throw new ArgumentException("Proper reason must be provided for deactivating the listed property.");

        var property = await _propertyRepository.GetByIdAsync(id);
        if (property == null)
            throw new KeyNotFoundException($"Property with ID {id} not found.");

        property.IsActive = false;
        property.DeactivationReason = reason.Trim();

        await _propertyRepository.UpdateAsync(property);
        return MapToDto(property);
    }

    public async Task<PropertyResponseDto> BuyPropertyAsync(int id, int buyerId)
    {
        var property = await _propertyRepository.GetByIdAsync(id);
        if (property == null)
            throw new KeyNotFoundException($"Property with ID {id} not found.");

        if (!property.IsActive)
            throw new InvalidOperationException("This property is not available for purchase or has already been sold.");

        property.IsActive = false;
        property.DeactivationReason = $"Sold to Buyer #{buyerId}";

        await _propertyRepository.UpdateAsync(property);
        return MapToDto(property);
    }

    public async Task<IEnumerable<PropertyResponseDto>> GetPurchasedPropertiesByBuyerIdAsync(int buyerId)
    {
        var properties = await _propertyRepository.GetPurchasedPropertiesByBuyerIdAsync(buyerId);
        return properties.Select(MapToDto);
    }

    public async Task<IEnumerable<PropertyResponseDto>> GetSoldPropertiesBySellerIdAsync(int sellerId)
    {
        var properties = await _propertyRepository.GetSoldPropertiesBySellerIdAsync(sellerId);
        return properties.Select(MapToDto);
    }

    public async Task<AdminSalesReportDto> GetSalesReportAsync()
    {
        var all = (await _propertyRepository.GetAllAsync()).ToList();
        var sold = all.Where(p => !p.IsActive && p.DeactivationReason != null && p.DeactivationReason.StartsWith("Sold")).ToList();
        var active = all.Where(p => p.IsActive).ToList();
        var deactivated = all.Where(p => !p.IsActive && (p.DeactivationReason == null || !p.DeactivationReason.StartsWith("Sold"))).ToList();

        return new AdminSalesReportDto
        {
            TotalProperties = all.Count,
            TotalActiveProperties = active.Count,
            TotalSoldProperties = sold.Count,
            TotalDeactivatedProperties = deactivated.Count,
            TotalSoldValue = sold.Sum(p => p.PriceRange),
            TotalActiveValue = active.Sum(p => p.PriceRange),
            SoldProperties = sold.Select(MapToDto).ToList()
        };
    }

    public async Task DeletePropertyAsync(int id)
    {
        await _propertyRepository.DeleteByIdAsync(id);
    }

    private static PropertyResponseDto MapToDto(Property p)
    {
        return new PropertyResponseDto
        {
            PropertyId = p.PropertyId,
            PropertyName = p.PropertyName,
            PropertyType = p.PropertyType,
            PropertyOption = p.PropertyOption,
            Description = p.Description,
            Address = p.Address,
            PriceRange = p.PriceRange,
            InitialDeposit = p.InitialDeposit,
            Landmark = p.Landmark,
            IsActive = p.IsActive,
            DeactivationReason = p.DeactivationReason,
            SellerId = p.SellerId,
            CityId = p.CityId
        };
    }
}

public class LocationAppService : ILocationAppService
{
    private readonly IStateRepository _stateRepository;
    private readonly ICityRepository _cityRepository;

    public LocationAppService(IStateRepository stateRepository, ICityRepository cityRepository)
    {
        _stateRepository = stateRepository;
        _cityRepository = cityRepository;
    }

    public async Task<IEnumerable<StateDto>> GetAllStatesAsync()
    {
        var list = await _stateRepository.GetAllAsync();
        return list.Select(s => new StateDto { StateId = s.StateId, StateName = s.StateName });
    }

    public async Task<StateDto> CreateStateAsync(StateDto dto)
    {
        var state = new State { StateName = dto.StateName.Trim() };
        var created = await _stateRepository.AddAsync(state);
        return new StateDto { StateId = created.StateId, StateName = created.StateName };
    }

    public async Task<IEnumerable<CityDto>> GetAllCitiesAsync()
    {
        var list = await _cityRepository.GetAllAsync();
        return list.Select(c => new CityDto { CityId = c.CityId, CityName = c.CityName, StateId = c.StateId });
    }

    public async Task<IEnumerable<CityDto>> GetCitiesByStateIdAsync(int stateId)
    {
        var list = await _cityRepository.GetCitiesByStateIdAsync(stateId);
        return list.Select(c => new CityDto { CityId = c.CityId, CityName = c.CityName, StateId = c.StateId });
    }

    public async Task<CityDto> CreateCityAsync(CityDto dto)
    {
        var city = new City { CityName = dto.CityName.Trim(), StateId = dto.StateId };
        var created = await _cityRepository.AddAsync(city);
        return new CityDto { CityId = created.CityId, CityName = created.CityName, StateId = created.StateId };
    }
}

public class ImageAppService : IImageAppService
{
    private readonly IPropertyImageRepository _imageRepository;
    private const int MaxImagesPerProperty = 6;

    public ImageAppService(IPropertyImageRepository imageRepository)
    {
        _imageRepository = imageRepository;
    }

    public async Task<IEnumerable<PropertyImageDto>> GetImagesByPropertyIdAsync(int propertyId)
    {
        var images = await _imageRepository.GetImagesByPropertyIdAsync(propertyId);
        return images.Select(i => new PropertyImageDto
        {
            ImageId = i.ImageId,
            PropertyId = i.PropertyId,
            ImageData = i.ImageData
        });
    }

    public async Task<IEnumerable<PropertyImageDto>> UploadImagesAsync(int propertyId, List<string> images)
    {
        if (images == null || images.Count == 0)
            throw new ArgumentException("No images provided.");

        var currentCount = await _imageRepository.GetImageCountByPropertyIdAsync(propertyId);
        if (currentCount + images.Count > MaxImagesPerProperty)
        {
            throw new InvalidOperationException($"Cannot upload {images.Count} image(s). A property can have a maximum of {MaxImagesPerProperty} images. Currently has {currentCount}.");
        }

        var results = new List<PropertyImageDto>();
        foreach (var img in images)
        {
            var entity = new PropertyImage
            {
                PropertyId = propertyId,
                ImageData = img
            };
            var added = await _imageRepository.AddAsync(entity);
            results.Add(new PropertyImageDto
            {
                ImageId = added.ImageId,
                PropertyId = added.PropertyId,
                ImageData = added.ImageData
            });
        }

        return results;
    }
}
