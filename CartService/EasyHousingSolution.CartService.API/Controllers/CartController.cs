using EasyHousingSolution.CartService.Application.DTOs;
using EasyHousingSolution.CartService.Application.Interfaces;
using EasyHousingSolution.Shared.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EasyHousingSolution.CartService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Buyer")]
public class CartController : ControllerBase
{
    private readonly ICartAppService _cartService;

    public CartController(ICartAppService cartService)
    {
        _cartService = cartService;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<CartItemDto>>> AddToCart([FromBody] AddToCartDto dto)
    {
        var item = await _cartService.AddToCartAsync(dto);
        return CreatedAtAction(nameof(GetCartByBuyerId), new { buyerId = item.BuyerId }, ApiResponse<CartItemDto>.Ok(item, "Property added to cart successfully."));
    }

    // Returns enriched cart items with full property details fetched via HttpClient
    [HttpGet("buyer/{buyerId:int}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<EnrichedCartItemDto>>>> GetCartByBuyerId(int buyerId)
    {
        var items = await _cartService.GetCartByBuyerIdAsync(buyerId);
        return Ok(ApiResponse<IEnumerable<EnrichedCartItemDto>>.Ok(items));
    }

    [HttpDelete("{cartId:int}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteCartItem(int cartId)
    {
        await _cartService.DeleteFromCartAsync(cartId);
        return Ok(ApiResponse<bool>.Ok(true, "Item removed from cart."));
    }

    [HttpDelete("buyer/{buyerId:int}/property/{propertyId:int}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteCartItemByBuyerAndProperty(int buyerId, int propertyId)
    {
        await _cartService.DeleteFromCartByBuyerAndPropertyAsync(buyerId, propertyId);
        return Ok(ApiResponse<bool>.Ok(true, "Item removed from cart."));
    }
}
