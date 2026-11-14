using Microsoft.EntityFrameworkCore;
using EasyHousingSolution.BuyerService.Domain.Entities;
using EasyHousingSolution.BuyerService.Domain.Interfaces;
using EasyHousingSolution.BuyerService.Infrastructure.Data;

namespace EasyHousingSolution.BuyerService.Infrastructure.Repositories;

public class CartRepository : ICartRepository
{
    private readonly BuyerDbContext _context;

    public CartRepository(BuyerDbContext context)
    {
        _context = context;
    }

    public async Task<CartItem?> GetByIdAsync(int id)
    {
        return await _context.CartItems.FindAsync(id);
    }

    public async Task<IEnumerable<CartItem>> GetAllAsync()
    {
        return await _context.CartItems.AsNoTracking().ToListAsync();
    }

    public async Task<CartItem> AddAsync(CartItem entity)
    {
        _context.CartItems.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(CartItem entity)
    {
        _context.CartItems.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(CartItem entity)
    {
        _context.CartItems.Remove(entity);
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

    public async Task<IEnumerable<CartItem>> GetByBuyerIdAsync(int buyerId)
    {
        return await _context.CartItems
            .AsNoTracking()
            .Where(c => c.BuyerId == buyerId)
            .ToListAsync();
    }

    public async Task<CartItem?> GetItemAsync(int buyerId, int propertyId)
    {
        return await _context.CartItems
            .FirstOrDefaultAsync(c => c.BuyerId == buyerId && c.PropertyId == propertyId);
    }
}
