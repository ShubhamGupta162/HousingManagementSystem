using EasyHousingSolution.CartService.Domain.Entities;
using EasyHousingSolution.Shared.Common;

namespace EasyHousingSolution.CartService.Domain.Interfaces;

public interface ICartRepository : IRepository<CartItem>
{
    Task<IEnumerable<CartItem>> GetByBuyerIdAsync(int buyerId);
    Task<CartItem?> GetItemAsync(int buyerId, int propertyId);
    Task DeleteByBuyerAndPropertyAsync(int buyerId, int propertyId);
}
