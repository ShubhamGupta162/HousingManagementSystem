using EasyHousingSolution.CartService.Application.DTOs;

namespace EasyHousingSolution.CartService.Application.Interfaces;

public interface ICartAppService
{
    Task<CartItemDto> AddToCartAsync(AddToCartDto dto);
    Task<IEnumerable<EnrichedCartItemDto>> GetCartByBuyerIdAsync(int buyerId);
    Task DeleteFromCartAsync(int cartId);
    Task DeleteFromCartByBuyerAndPropertyAsync(int buyerId, int propertyId);
}
