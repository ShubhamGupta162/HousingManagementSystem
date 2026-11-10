using EasyHousingSolution.IdentityService.Domain.Entities;
using EasyHousingSolution.IdentityService.Domain.Interfaces;
using EasyHousingSolution.IdentityService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EasyHousingSolution.IdentityService.Infrastructure.Repositories;

public class BuyerRepository : IBuyerRepository
{
    private readonly IdentityDbContext _context;

    public BuyerRepository(IdentityDbContext context)
    {
        _context = context;
    }

    public async Task<Buyer?> GetByIdAsync(int id)
    {
        return await _context.Buyers.FindAsync(id);
    }

    public async Task<Buyer?> GetByEmailAsync(string emailId)
    {
        return await _context.Buyers.FirstOrDefaultAsync(b => b.EmailId == emailId);
    }

    public async Task<IEnumerable<Buyer>> GetAllAsync()
    {
        return await _context.Buyers.ToListAsync();
    }

    public async Task<Buyer> AddAsync(Buyer entity)
    {
        var entry = await _context.Buyers.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entry.Entity;
    }

    public async Task UpdateAsync(Buyer entity)
    {
        _context.Buyers.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Buyer entity)
    {
        _context.Buyers.Remove(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteByIdAsync(int id)
    {
        var item = await GetByIdAsync(id);
        if (item != null)
        {
            await DeleteAsync(item);
        }
    }
}
