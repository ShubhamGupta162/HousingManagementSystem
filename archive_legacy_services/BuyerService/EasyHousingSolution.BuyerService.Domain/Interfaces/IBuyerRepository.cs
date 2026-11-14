using EasyHousingSolution.BuyerService.Domain.Entities;
using EasyHousingSolution.Shared.Common;

namespace EasyHousingSolution.BuyerService.Domain.Interfaces;

public interface IBuyerRepository : IRepository<Buyer>
{
    Task<Buyer?> GetByEmailAsync(string emailId);
    Task<Buyer?> GetByUserIdAsync(int userId);
}
