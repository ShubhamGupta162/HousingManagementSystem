using EasyHousingSolution.IdentityService.Domain.Entities;
using EasyHousingSolution.IdentityService.Domain.Interfaces;
using EasyHousingSolution.IdentityService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EasyHousingSolution.IdentityService.Infrastructure.Repositories;

public class SellerRepository : ISellerRepository
{
    private readonly IdentityDbContext _context;

    public SellerRepository(IdentityDbContext context)
    {
        _context = context;
    }

    public async Task<Seller?> GetByIdAsync(int id)
    {
        return await _context.Sellers.FindAsync(id);
    }

    public async Task<Seller?> GetByEmailAsync(string emailId)
    {
        return await _context.Sellers.FirstOrDefaultAsync(s => s.EmailId == emailId);
    }

    public async Task<IEnumerable<Seller>> GetAllAsync()
    {
        return await _context.Sellers.ToListAsync();
    }

    public async Task<Seller> AddAsync(Seller entity)
    {
        var entry = await _context.Sellers.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entry.Entity;
    }

    public async Task UpdateAsync(Seller entity)
    {
        _context.Sellers.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Seller entity)
    {
        _context.Sellers.Remove(entity);
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
