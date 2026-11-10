using EasyHousingSolution.IdentityService.Domain.Entities;
using EasyHousingSolution.Shared.Common;

namespace EasyHousingSolution.IdentityService.Domain.Interfaces;

public interface ISellerRepository : IRepository<Seller>
{
    Task<Seller?> GetByEmailAsync(string emailId);
}
