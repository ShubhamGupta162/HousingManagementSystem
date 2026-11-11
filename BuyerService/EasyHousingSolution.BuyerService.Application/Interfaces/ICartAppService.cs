using EasyHousingSolution.BuyerService.Application.DTOs;

namespace EasyHousingSolution.BuyerService.Application.Interfaces;

public interface ICartAppService
{
    Task<CartItemDto> AddToCartAsync(AddToCartDto dto);
    Task<bool> RemoveFromCartAsync(int cartId);
    Task<IEnumerable<EnrichedCartItemDto>> GetBuyerCartAsync(int buyerId);
}
