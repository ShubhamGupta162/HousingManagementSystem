using EasyHousingSolution.UserService.Domain.Entities;

namespace EasyHousingSolution.UserService.Domain.Interfaces;

public interface IBuyerRepository
{
    Task<Buyer?> GetByIdAsync(int buyerId);
    Task<Buyer?> GetByEmailAsync(string emailId);
    Task<Buyer?> GetByUserNameAsync(string userName);
    Task<IEnumerable<Buyer>> GetAllAsync();
    Task<Buyer> AddAsync(Buyer buyer);
    Task UpdateAsync(Buyer buyer);
    Task DeleteAsync(Buyer buyer);
    Task<bool> ExistsAsync(string emailId);
}
