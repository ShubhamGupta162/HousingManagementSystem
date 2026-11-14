using Microsoft.EntityFrameworkCore;
using EasyHousingSolution.BuyerService.Domain.Entities;
using EasyHousingSolution.BuyerService.Domain.Interfaces;
using EasyHousingSolution.BuyerService.Infrastructure.Data;

namespace EasyHousingSolution.BuyerService.Infrastructure.Repositories;

public class BuyerRepository : IBuyerRepository
{
    private readonly BuyerDbContext _context;

    public BuyerRepository(BuyerDbContext context)
    {
        _context = context;
    }

    public async Task<Buyer?> GetByIdAsync(int id)
    {
        return await _context.Buyers.FindAsync(id);
    }

    public async Task<IEnumerable<Buyer>> GetAllAsync()
    {
        return await _context.Buyers.AsNoTracking().ToListAsync();
    }

    public async Task<Buyer> AddAsync(Buyer entity)
    {
        _context.Buyers.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
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
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            await DeleteAsync(entity);
        }
    }

    public async Task<Buyer?> GetByEmailAsync(string emailId)
    {
        return await _context.Buyers
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.EmailId == emailId.ToLowerInvariant());
    }

    public async Task<Buyer?> GetByUserIdAsync(int userId)
    {
        return await _context.Buyers
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.UserId == userId);
    }
}
