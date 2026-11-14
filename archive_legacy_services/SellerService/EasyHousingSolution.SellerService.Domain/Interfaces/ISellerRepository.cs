using EasyHousingSolution.SellerService.Domain.Entities;
using EasyHousingSolution.Shared.Common;

namespace EasyHousingSolution.SellerService.Domain.Interfaces;

public interface ISellerRepository : IRepository<Seller>
{
    Task<Seller?> GetByEmailAsync(string emailId);
    Task<Seller?> GetByUserIdAsync(int userId);
}
