using EasyHousingSolution.IdentityService.Domain.Entities;

namespace EasyHousingSolution.IdentityService.Domain.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByUserNameAsync(string userName);
    Task<IEnumerable<User>> GetAllUsersAsync();
    Task AddUserAsync(User user);
    Task<bool> ExistsAsync(string userName);
}
