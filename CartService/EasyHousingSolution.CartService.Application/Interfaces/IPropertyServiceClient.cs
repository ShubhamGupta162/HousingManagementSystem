using EasyHousingSolution.CartService.Application.DTOs;

namespace EasyHousingSolution.CartService.Application.Interfaces;

public interface IPropertyServiceClient
{
    Task<PropertySummaryDto?> GetPropertyByIdAsync(int propertyId);
}
