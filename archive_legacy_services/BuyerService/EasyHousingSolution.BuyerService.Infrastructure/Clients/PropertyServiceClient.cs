using System.Net.Http.Json;
using EasyHousingSolution.BuyerService.Application.DTOs;
using EasyHousingSolution.BuyerService.Application.Interfaces;
using EasyHousingSolution.Shared.Common;
using Microsoft.Extensions.Logging;

namespace EasyHousingSolution.BuyerService.Infrastructure.Clients;

public class PropertyServiceClient : IPropertyServiceClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<PropertyServiceClient> _logger;

    public PropertyServiceClient(HttpClient httpClient, ILogger<PropertyServiceClient> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<PropertySummaryDto?> GetPropertySummaryAsync(int propertyId)
    {
        try
        {
            _logger.LogInformation("Calling PropertyService for PropertyId {PropertyId}", propertyId);
            var response = await _httpClient.GetFromJsonAsync<ApiResponse<PropertySummaryDto>>($"api/properties/{propertyId}");
            return response?.Data;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve property summary for PropertyId {PropertyId}", propertyId);
            return null;
        }
    }
}
