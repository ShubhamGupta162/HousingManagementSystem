using EasyHousingSolution.BuyerService.Application.DTOs;

namespace EasyHousingSolution.BuyerService.Application.Interfaces;

public interface IPropertyServiceClient
{
    Task<PropertySummaryDto?> GetPropertySummaryAsync(int propertyId);
}
