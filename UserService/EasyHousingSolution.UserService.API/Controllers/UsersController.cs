using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EasyHousingSolution.UserService.Application.DTOs;
using EasyHousingSolution.UserService.Application.Interfaces;

namespace EasyHousingSolution.UserService.API.Controllers;

[ApiController]
[Route("api")]
public class UsersController : ControllerBase
{
    private readonly IUserAppService _userAppService;
    private readonly IBuyerAppService _buyerAppService;
    private readonly ISellerAppService _sellerAppService;

    public UsersController(
        IUserAppService userAppService,
        IBuyerAppService buyerAppService,
        ISellerAppService sellerAppService)
    {
        _userAppService = userAppService;
        _buyerAppService = buyerAppService;
        _sellerAppService = sellerAppService;
    }

    private int GetTokenProfileId()
    {
        var claim = User.FindFirst("profileId")?.Value
                 ?? User.FindFirst("sellerId")?.Value
                 ?? User.FindFirst("buyerId")?.Value;
        return int.TryParse(claim, out var id) ? id : 0;
    }

    // =========================================================================
    // PROFILE SELF-SERVICE (Buyer / Seller - Token based)
    // =========================================================================

    [HttpGet("users/me")]
    [Authorize]
    [Tags("User")]
    public async Task<IActionResult> GetMyProfile()
    {
        var id = GetTokenProfileId();
        if (id <= 0) return Unauthorized("Invalid token.");

        var user = await _userAppService.GetUserByIdAsync(id);
        return user != null ? Ok(user) : NotFound("User profile not found.");
    }

    [HttpPut("users/me")]
    [Authorize]
    [Tags("User")]
    public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateUserProfileDto dto)
    {
        var id = GetTokenProfileId();
        if (id <= 0) return Unauthorized("Invalid token.");

        if (User.IsInRole("Seller"))
        {
            var updated = await _sellerAppService.UpdateSellerProfileAsync(id, new UpdateSellerProfileDto
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                PhoneNo = dto.PhoneNo,
                Address = dto.Address ?? string.Empty,
                StateId = dto.StateId ?? 1,
                CityId = dto.CityId ?? 1
            });
            return updated != null ? Ok(updated) : NotFound("Seller profile not found.");
        }
        else
        {
            var updated = await _buyerAppService.UpdateBuyerProfileAsync(id, new UpdateBuyerProfileDto
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                PhoneNo = dto.PhoneNo,
                DateOfBirth = dto.DateOfBirth
            });
            return updated != null ? Ok(updated) : NotFound("Buyer profile not found.");
        }
    }

    // =========================================================================
    // ADMIN USER GOVERNANCE (View, Deactivate, Delete)
    // =========================================================================

    [HttpGet("admin/users")]
    [Authorize(Roles = "Admin")]
    [Tags("Admin")]
    public async Task<IActionResult> GetAllUsers([FromQuery] string? role = null, [FromQuery] bool? isActive = null)
    {
        var users = await _userAppService.GetAllUsersAsync(role, isActive);
        return Ok(users);
    }

    [HttpGet("admin/users/{id:int}")]
    [Authorize(Roles = "Admin")]
    [Tags("Admin")]
    public async Task<IActionResult> GetUserById(int id)
    {
        var user = await _userAppService.GetUserByIdAsync(id);
        return user != null ? Ok(user) : NotFound($"User with ID {id} not found.");
    }

    [HttpPut("admin/users/{id:int}/deactivate")]
    [Authorize(Roles = "Admin")]
    [Tags("Admin")]
    public async Task<IActionResult> DeactivateUser(int id, [FromBody] UserStatusUpdateDto? dto)
    {
        var updated = await _userAppService.UpdateUserStatusAsync(id, false, dto?.Reason);
        return updated 
            ? Ok(new { success = true, message = $"User #{id} deactivated successfully." }) 
            : NotFound($"User with ID {id} not found.");
    }

    [HttpDelete("admin/users/{id:int}")]
    [Authorize(Roles = "Admin")]
    [Tags("Admin")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var deleted = await _userAppService.DeleteUserAsync(id);
        return deleted 
            ? Ok(new { success = true, message = $"User #{id} deleted successfully." }) 
            : NotFound($"User with ID {id} not found.");
    }

    // =========================================================================
    // INTERNAL PROVISIONING (Direct HttpClient calls from IdentityService)
    // =========================================================================

    [HttpPost("buyers")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public async Task<IActionResult> CreateBuyerProfile([FromBody] CreateBuyerDto dto)
    {
        var buyer = await _buyerAppService.CreateBuyerAsync(dto);
        return Ok(new { buyerId = buyer.BuyerId });
    }

    [HttpPost("sellers")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public async Task<IActionResult> CreateSellerProfile([FromBody] CreateSellerDto dto)
    {
        var seller = await _sellerAppService.CreateSellerAsync(dto);
        return Ok(new { sellerId = seller.SellerId });
    }
}
