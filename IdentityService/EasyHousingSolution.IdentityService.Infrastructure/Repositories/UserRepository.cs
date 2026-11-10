using EasyHousingSolution.IdentityService.Domain.Entities;
using EasyHousingSolution.IdentityService.Domain.Interfaces;
using EasyHousingSolution.IdentityService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EasyHousingSolution.IdentityService.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IdentityDbContext _context;

    public UserRepository(IdentityDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByUserNameAsync(string userName)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName);
    }

    public async Task<IEnumerable<User>> GetAllUsersAsync()
    {
        return await _context.Users.ToListAsync();
    }

    public async Task AddUserAsync(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> ExistsAsync(string userName)
    {
        return await _context.Users.AnyAsync(u => u.UserName == userName);
    }
}
