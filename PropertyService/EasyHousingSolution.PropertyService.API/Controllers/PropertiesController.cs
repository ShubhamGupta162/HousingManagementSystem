using EasyHousingSolution.PropertyService.Application.DTOs;
using EasyHousingSolution.PropertyService.Application.Interfaces;
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

    private int GetTokenProfileId()
    {
        var claim = User.FindFirst("profileId")?.Value
                 ?? User.FindFirst("sellerId")?.Value
                 ?? User.FindFirst("buyerId")?.Value;
        return int.TryParse(claim, out var id) ? id : 0;
    }

    [HttpGet]
    [Tags("Buyer")]
    public async Task<IActionResult> GetAllProperties()
    {
        var properties = await _propertyService.GetVerifiedPropertiesAsync();
        return Ok(properties);
    }

    [HttpPost]
    [Tags("Seller")]
    [Authorize(Roles = "Seller")]
    public async Task<IActionResult> CreateProperty(CreatePropertyDto dto)
    {
        if (dto.SellerId <= 0)
        {
            var profileId = GetTokenProfileId();
            dto.SellerId = profileId > 0 ? profileId : 1;
        }

        var created = await _propertyService.CreatePropertyAsync(dto);
        return CreatedAtAction(nameof(GetPropertyById), new { id = created.PropertyId }, created);
    }

    [HttpPut("{id:int}")]
    [Tags("Seller")]
    [Authorize(Roles = "Seller,Admin")]
    public async Task<IActionResult> UpdateProperty(int id, UpdatePropertyDto dto)
    {
        var existing = await _propertyService.GetPropertyByIdAsync(id);
        if (existing == null)
        {
            return NotFound($"Property with ID {id} not found.");
        }

        var tokenSellerId = GetTokenProfileId();
        if (!User.IsInRole("Admin") && existing.SellerId != tokenSellerId)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = "You do not own this property and cannot modify it." });
        }

        var updated = await _propertyService.UpdatePropertyAsync(id, dto);
        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    [Tags("Seller")]
    [Authorize(Roles = "Seller,Admin")]
    public async Task<IActionResult> DeleteProperty(int id)
    {
        var existing = await _propertyService.GetPropertyByIdAsync(id);
        if (existing == null)
        {
            return NotFound($"Property with ID {id} not found.");
        }

        var tokenSellerId = GetTokenProfileId();
        if (!User.IsInRole("Admin") && existing.SellerId != tokenSellerId)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = "You do not own this property and cannot delete it." });
        }

        await _propertyService.DeletePropertyAsync(id);
        return Ok(new { success = true, message = "Property deleted successfully." });
    }

    [HttpGet("{id:int}")]
    [Tags("Buyer")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPropertyById(int id)
    {
        var property = await _propertyService.GetPropertyByIdAsync(id);
        if (property == null)
        {
            return NotFound($"Property with ID {id} not found.");
        }
        return Ok(property);
    }

    [HttpGet("search")]
    [Tags("Buyer")]
    [AllowAnonymous]
    public async Task<IActionResult> SearchProperties(
        int? cityId,
        string? propertyType,
        string? propertyOption,
        string? sortBy)
    {
        var properties = await _propertyService.SearchPropertiesAsync(cityId, propertyType, propertyOption, sortBy);
        return Ok(properties);
    }

    // --- Seller Self-Service Endpoints (Token-Based, No ID needed in URL) ---

    [HttpGet("my-properties")]
    [Tags("Seller")]
    [Authorize(Roles = "Seller")]
    public async Task<IActionResult> GetMyProperties([FromQuery] string? status)
    {
        var sellerId = GetTokenProfileId();
        if (sellerId <= 0) return Unauthorized("Seller profile ID not found in token.");

        if (string.Equals(status, "verified", StringComparison.OrdinalIgnoreCase))
        {
            var verified = await _propertyService.GetPropertiesBySellerAsync(sellerId, isActive: true);
            return Ok(verified);
        }
        if (string.Equals(status, "deactivated", StringComparison.OrdinalIgnoreCase))
        {
            var deactivated = await _propertyService.GetPropertiesBySellerAsync(sellerId, isActive: false);
            return Ok(deactivated);
        }
        var all = await _propertyService.GetPropertiesBySellerAsync(sellerId);
        return Ok(all);
    }

    // --- Admin Property Moderation & Status Endpoints ---

    [HttpGet("admin/all")]
    [HttpGet("/api/admin/properties")]
    [Tags("Admin")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllPropertiesForAdmin()
    {
        var properties = await _propertyService.GetAllPropertiesAsync();
        return Ok(properties);
    }

    [HttpPut("{id:int}/approve")]
    [Tags("Admin")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ApproveProperty(int id)
    {
        var result = await _propertyService.VerifyPropertyAsync(id);
        return Ok(result);
    }

    [HttpPut("{id:int}/reject")]
    [Tags("Admin")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> RejectProperty(int id, [FromBody] DeactivatePropertyDto? dto)
    {
        var reason = !string.IsNullOrWhiteSpace(dto?.Reason) ? dto.Reason : "Rejected by Administrator";
        var result = await _propertyService.DeactivatePropertyAsync(id, reason);
        return Ok(result);
    }

    [HttpPut("{id:int}/status")]
    [Tags("Admin")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdatePropertyStatus(int id, [FromBody] PropertyStatusUpdateDto dto)
    {
        PropertyResponseDto result;
        if (dto.IsActive)
        {
            result = await _propertyService.VerifyPropertyAsync(id);
        }
        else
        {
            result = await _propertyService.DeactivatePropertyAsync(id, dto.Reason ?? "Deactivated by Administrator");
        }
        return Ok(result);
    }
}
