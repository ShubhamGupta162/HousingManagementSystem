using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EasyHousingSolution.BuyerService.Application.DTOs;
using EasyHousingSolution.BuyerService.Application.Interfaces;
using EasyHousingSolution.Shared.Common;

namespace EasyHousingSolution.BuyerService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Buyer")]
public class CartController : ControllerBase
{
    private readonly ICartAppService _cartAppService;

    public CartController(ICartAppService cartAppService)
    {
        _cartAppService = cartAppService;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<CartItemDto>>> AddToCart([FromBody] AddToCartDto dto)
    {
        var result = await _cartAppService.AddToCartAsync(dto);
        return Ok(ApiResponse<CartItemDto>.Ok(result, "Property added to cart"));
    }

    [HttpDelete("{cartId:int}")]
    public async Task<ActionResult<ApiResponse<bool>>> RemoveFromCart(int cartId)
    {
        var result = await _cartAppService.RemoveFromCartAsync(cartId);
        if (!result) return NotFound(ApiResponse<bool>.Fail("Cart item not found"));
        return Ok(ApiResponse<bool>.Ok(true, "Property removed from cart"));
    }

    [HttpGet("buyer/{buyerId:int}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<EnrichedCartItemDto>>>> GetBuyerCart(int buyerId)
    {
        var result = await _cartAppService.GetBuyerCartAsync(buyerId);
        return Ok(ApiResponse<IEnumerable<EnrichedCartItemDto>>.Ok(result));
    }
}
