using EasyHousingSolution.PropertyService.Application.DTOs;
using EasyHousingSolution.PropertyService.Application.Interfaces;
using EasyHousingSolution.Shared.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EasyHousingSolution.PropertyService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class VerificationsController : ControllerBase
{
    private readonly IPropertyAppService _propertyService;

    public VerificationsController(IPropertyAppService propertyService)
    {
        _propertyService = propertyService;
    }

    // Admin can see all properties
    [HttpGet("all")]
    public async Task<ActionResult<ApiResponse<IEnumerable<PropertyResponseDto>>>> GetAllPropertiesForAdmin()
    {
        var properties = await _propertyService.GetAllPropertiesAsync();
        return Ok(ApiResponse<IEnumerable<PropertyResponseDto>>.Ok(properties));
    }

    // Admin verifies property
    [HttpPut("{id:int}/verify")]
    public async Task<ActionResult<ApiResponse<PropertyResponseDto>>> VerifyProperty(int id)
    {
        var verified = await _propertyService.VerifyPropertyAsync(id);
        return Ok(ApiResponse<PropertyResponseDto>.Ok(verified, "Property successfully verified and listed."));
    }

    // Admin deactivates property with reason
    [HttpPut("{id:int}/deactivate")]
    public async Task<ActionResult<ApiResponse<PropertyResponseDto>>> DeactivateProperty(int id, [FromBody] DeactivatePropertyDto dto)
    {
        var deactivated = await _propertyService.DeactivatePropertyAsync(id, dto.Reason);
        return Ok(ApiResponse<PropertyResponseDto>.Ok(deactivated, "Property deactivated."));
    }
}
