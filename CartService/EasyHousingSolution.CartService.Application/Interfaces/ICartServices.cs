using EasyHousingSolution.CartService.Application.DTOs;

namespace EasyHousingSolution.CartService.Application.Interfaces;

public interface ICartAppService
{
    Task<CartItemDto> AddToCartAsync(AddToCartDto dto);
    Task<bool> RemoveFromCartAsync(int cartId);
    Task<bool> RemovePropertyFromCartAsync(int buyerId, int propertyId);
    Task<IEnumerable<EnrichedCartItemDto>> GetBuyerCartAsync(int buyerId);
    Task<bool> ClearBuyerCartAsync(int buyerId);
}

