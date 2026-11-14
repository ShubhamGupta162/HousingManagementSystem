using EasyHousingSolution.CartService.Domain.Entities;

namespace EasyHousingSolution.CartService.Domain.Interfaces;

public interface ICartRepository
{
    Task<CartItem?> GetByIdAsync(int cartId);
    Task<IEnumerable<CartItem>> GetByBuyerIdAsync(int buyerId);
    Task<CartItem> AddAsync(CartItem item);
    Task<bool> RemoveAsync(int cartId);
    Task<bool> ExistsAsync(int buyerId, int propertyId);
    Task<bool> ClearBuyerCartAsync(int buyerId);
}
