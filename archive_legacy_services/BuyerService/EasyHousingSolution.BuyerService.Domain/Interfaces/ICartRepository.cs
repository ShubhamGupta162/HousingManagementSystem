using EasyHousingSolution.BuyerService.Domain.Entities;
using EasyHousingSolution.Shared.Common;

namespace EasyHousingSolution.BuyerService.Domain.Interfaces;

public interface ICartRepository : IRepository<CartItem>
{
    Task<IEnumerable<CartItem>> GetByBuyerIdAsync(int buyerId);
    Task<CartItem?> GetItemAsync(int buyerId, int propertyId);
}
