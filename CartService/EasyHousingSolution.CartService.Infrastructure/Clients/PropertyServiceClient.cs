using System.Net.Http.Json;
using EasyHousingSolution.CartService.Application.DTOs;
using EasyHousingSolution.CartService.Application.Interfaces;
using EasyHousingSolution.Shared.Common;
using Microsoft.Extensions.Logging;

namespace EasyHousingSolution.CartService.Infrastructure.Clients;

public class PropertyServiceClient : IPropertyServiceClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<PropertyServiceClient> _logger;

    public PropertyServiceClient(HttpClient httpClient, ILogger<PropertyServiceClient> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<PropertySummaryDto?> GetPropertyByIdAsync(int propertyId)
    {
        try
        {
            var response = await _httpClient.GetAsync($"/api/properties/{propertyId}");
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("PropertyService returned {StatusCode} for PropertyId {PropertyId}", response.StatusCode, propertyId);
                return null;
            }

            var apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<PropertySummaryDto>>();
            return apiResponse?.Data;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to communicate with PropertyService for PropertyId {PropertyId}", propertyId);
            return null;
        }
    }
}
