using EasyHousingSolution.UserService.Domain.Entities;

namespace EasyHousingSolution.UserService.Domain.Interfaces;

public interface ISellerRepository
{
    Task<Seller?> GetByIdAsync(int sellerId);
    Task<Seller?> GetByEmailAsync(string emailId);
    Task<Seller?> GetByUserNameAsync(string userName);
    Task<IEnumerable<Seller>> GetAllAsync();
    Task<Seller> AddAsync(Seller seller);
    Task UpdateAsync(Seller seller);
    Task DeleteAsync(Seller seller);
    Task<bool> ExistsAsync(string emailId);
}
