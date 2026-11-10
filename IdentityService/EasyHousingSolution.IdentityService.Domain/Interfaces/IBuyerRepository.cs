using EasyHousingSolution.IdentityService.Domain.Entities;
using EasyHousingSolution.Shared.Common;

namespace EasyHousingSolution.IdentityService.Domain.Interfaces;

public interface IBuyerRepository : IRepository<Buyer>
{
    Task<Buyer?> GetByEmailAsync(string emailId);
}
