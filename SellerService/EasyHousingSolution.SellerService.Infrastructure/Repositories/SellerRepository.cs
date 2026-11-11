using Microsoft.EntityFrameworkCore;
using EasyHousingSolution.SellerService.Domain.Entities;
using EasyHousingSolution.SellerService.Domain.Interfaces;
using EasyHousingSolution.SellerService.Infrastructure.Data;

namespace EasyHousingSolution.SellerService.Infrastructure.Repositories;

public class SellerRepository : ISellerRepository
{
    private readonly SellerDbContext _context;

    public SellerRepository(SellerDbContext context)
    {
        _context = context;
    }

    public async Task<Seller?> GetByIdAsync(int id)
    {
        return await _context.Sellers.FindAsync(id);
    }

    public async Task<IEnumerable<Seller>> GetAllAsync()
    {
        return await _context.Sellers.AsNoTracking().ToListAsync();
    }

    public async Task<Seller> AddAsync(Seller entity)
    {
        _context.Sellers.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
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
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            await DeleteAsync(entity);
        }
    }

    public async Task<Seller?> GetByEmailAsync(string emailId)
    {
        return await _context.Sellers
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.EmailId == emailId.ToLowerInvariant());
    }

    public async Task<Seller?> GetByUserIdAsync(int userId)
    {
        return await _context.Sellers
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.UserId == userId);
    }
}
