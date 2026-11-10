using EasyHousingSolution.PropertyService.Application.DTOs;
using EasyHousingSolution.PropertyService.Application.Interfaces;
using EasyHousingSolution.Shared.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EasyHousingSolution.PropertyService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PropertiesController : ControllerBase
{
    private readonly IPropertyAppService _propertyService;

    public PropertiesController(IPropertyAppService propertyService)
    {
        _propertyService = propertyService;
    }

    // Only Seller can post/add property
    [HttpPost]
    [Authorize(Roles = "Seller")]
    public async Task<ActionResult<ApiResponse<PropertyResponseDto>>> CreateProperty([FromBody] CreatePropertyDto dto)
    {
        var created = await _propertyService.CreatePropertyAsync(dto);
        return CreatedAtAction(nameof(GetPropertyById), new { id = created.PropertyId }, ApiResponse<PropertyResponseDto>.Ok(created, "Property added successfully. Awaiting administrator verification."));
    }

    // Only Seller can edit their property
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Seller")]
    public async Task<ActionResult<ApiResponse<PropertyResponseDto>>> UpdateProperty(int id, [FromBody] UpdatePropertyDto dto)
    {
        var updated = await _propertyService.UpdatePropertyAsync(id, dto);
        return Ok(ApiResponse<PropertyResponseDto>.Ok(updated, "Property updated successfully."));
    }

    // Public / Buyers can view property details
    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<PropertyResponseDto>>> GetPropertyById(int id)
    {
        var property = await _propertyService.GetPropertyByIdAsync(id);
        if (property == null)
        {
            return NotFound(ApiResponse<PropertyResponseDto>.Fail($"Property with ID {id} not found."));
        }
        return Ok(ApiResponse<PropertyResponseDto>.Ok(property));
    }

    // Public / Buyers can view all verified properties
    [HttpGet("verified")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<IEnumerable<PropertyResponseDto>>>> GetVerifiedProperties()
    {
        var properties = await _propertyService.GetVerifiedPropertiesAsync();
        return Ok(ApiResponse<IEnumerable<PropertyResponseDto>>.Ok(properties));
    }

    // Public / Buyers can search properties by city, type, and sort by price/name
    [HttpGet("search")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<IEnumerable<PropertyResponseDto>>>> SearchProperties(
        [FromQuery] int? cityId,
        [FromQuery] string? propertyType,
        [FromQuery] string? propertyOption,
        [FromQuery] string? sortBy)
    {
        var properties = await _propertyService.SearchPropertiesAsync(cityId, propertyType, propertyOption, sortBy);
        return Ok(ApiResponse<IEnumerable<PropertyResponseDto>>.Ok(properties));
    }

    // Seller views their verified properties (Admin can also view)
    [HttpGet("seller/{sellerId:int}/verified")]
    [Authorize(Roles = "Seller,Admin")]
    public async Task<ActionResult<ApiResponse<IEnumerable<PropertyResponseDto>>>> GetSellerVerifiedProperties(int sellerId)
    {
        var properties = await _propertyService.GetPropertiesBySellerAsync(sellerId, isActive: true);
        return Ok(ApiResponse<IEnumerable<PropertyResponseDto>>.Ok(properties));
    }

    // Seller views their deactivated properties (Admin can also view)
    [HttpGet("seller/{sellerId:int}/deactivated")]
    [Authorize(Roles = "Seller,Admin")]
    public async Task<ActionResult<ApiResponse<IEnumerable<PropertyResponseDto>>>> GetSellerDeactivatedProperties(int sellerId)
    {
        var properties = await _propertyService.GetPropertiesBySellerAsync(sellerId, isActive: false);
        return Ok(ApiResponse<IEnumerable<PropertyResponseDto>>.Ok(properties));
    }

    // View all properties by seller (Admin can view by owner; Seller can view their own)
    [HttpGet("seller/{sellerId:int}/all")]
    [Authorize(Roles = "Seller,Admin")]
    public async Task<ActionResult<ApiResponse<IEnumerable<PropertyResponseDto>>>> GetSellerAllProperties(int sellerId)
    {
        var properties = await _propertyService.GetPropertiesBySellerAsync(sellerId);
        return Ok(ApiResponse<IEnumerable<PropertyResponseDto>>.Ok(properties));
    }

    // Seller or Admin can delete
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Seller,Admin")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteProperty(int id)
    {
        await _propertyService.DeletePropertyAsync(id);
        return Ok(ApiResponse<bool>.Ok(true, "Property deleted successfully."));
    }
}
