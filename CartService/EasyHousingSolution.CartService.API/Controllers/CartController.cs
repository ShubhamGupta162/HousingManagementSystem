using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EasyHousingSolution.CartService.Application.DTOs;
using EasyHousingSolution.CartService.Application.Interfaces;

namespace EasyHousingSolution.CartService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly ICartAppService _cartAppService;

    public CartController(ICartAppService cartAppService)
    {
        _cartAppService = cartAppService;
    }

    private int GetTokenProfileId()
    {
        var claim = User.FindFirst("profileId")?.Value
                 ?? User.FindFirst("buyerId")?.Value;
        return int.TryParse(claim, out var id) ? id : 0;
    }

    [HttpPost("items")]
    [Authorize(Roles = "Buyer")]
    [Tags("Buyer")]
    public async Task<IActionResult> AddToCart(AddToCartDto dto)
    {
        if (dto.BuyerId <= 0)
        {
            var buyerId = GetTokenProfileId();
            if (buyerId <= 0)
            {
                return Unauthorized(new { message = "Invalid token or buyer profile not found." });
            }
            dto.BuyerId = buyerId;
        }

        var result = await _cartAppService.AddToCartAsync(dto);
        return Ok(result);
    }

    [HttpDelete("items/{propertyId:int}")]
    [Authorize(Roles = "Buyer")]
    [Tags("Buyer")]
    public async Task<IActionResult> RemovePropertyFromCart(int propertyId)
    {
        var buyerId = GetTokenProfileId();
        if (buyerId <= 0)
        {
            return Unauthorized(new { message = "Invalid token or buyer profile not found." });
        }
        var result = await _cartAppService.RemovePropertyFromCartAsync(buyerId, propertyId);
        if (!result)
        {
            return NotFound(new { success = false, message = $"Property with ID {propertyId} not found in cart." });
        }
        return Ok(new { success = true, message = "Property removed from cart successfully." });
    }

    [HttpGet]
    [Authorize(Roles = "Buyer")]
    [Tags("Buyer")]
    public async Task<IActionResult> GetMyCart()
    {
        var buyerId = GetTokenProfileId();
        if (buyerId <= 0)
        {
            return Unauthorized(new { message = "Invalid token or buyer profile not found." });
        }
        var result = await _cartAppService.GetBuyerCartAsync(buyerId);
        return Ok(result);
    }

    [HttpDelete]
    [Authorize(Roles = "Buyer")]
    [Tags("Buyer")]
    public async Task<IActionResult> ClearMyCart()
    {
        var buyerId = GetTokenProfileId();
        if (buyerId <= 0)
        {
            return Unauthorized(new { message = "Invalid token or buyer profile not found." });
        }
        var result = await _cartAppService.ClearBuyerCartAsync(buyerId);
        return Ok(new { success = true, message = "Cart cleared successfully." });
    }
}
