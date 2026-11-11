using System.Net.Http.Json;
using EasyHousingSolution.BuyerService.Application.DTOs;
using EasyHousingSolution.BuyerService.Application.Interfaces;
using EasyHousingSolution.Shared.Common;

namespace EasyHousingSolution.BuyerService.Infrastructure.Clients;

public class PropertyServiceClient : IPropertyServiceClient
{
    private readonly HttpClient _httpClient;

    public PropertyServiceClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<PropertySummaryDto?> GetPropertySummaryAsync(int propertyId)
    {
        try
        {
            var response = await _httpClient.GetFromJsonAsync<ApiResponse<PropertySummaryDto>>($"http://localhost:5002/api/properties/{propertyId}");
            return response?.Data;
        }
        catch
        {
            return null;
        }
    }
}
