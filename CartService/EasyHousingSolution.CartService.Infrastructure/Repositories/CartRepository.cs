using EasyHousingSolution.CartService.Domain.Entities;
using EasyHousingSolution.CartService.Domain.Interfaces;
using EasyHousingSolution.CartService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EasyHousingSolution.CartService.Infrastructure.Repositories;

public class CartRepository : ICartRepository
{
    private readonly CartDbContext _context;

    public CartRepository(CartDbContext context)
    {
        _context = context;
    }

    public async Task<CartItem?> GetByIdAsync(int id)
    {
        return await _context.CartItems.FindAsync(id);
    }

    public async Task<IEnumerable<CartItem>> GetAllAsync()
    {
        return await _context.CartItems.ToListAsync();
    }

    public async Task<CartItem> AddAsync(CartItem entity)
    {
        var entry = await _context.CartItems.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entry.Entity;
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
        var item = await GetByIdAsync(id);
        if (item != null)
        {
            await DeleteAsync(item);
        }
    }

    public async Task<IEnumerable<CartItem>> GetByBuyerIdAsync(int buyerId)
    {
        return await _context.CartItems
            .Where(c => c.BuyerId == buyerId)
            .ToListAsync();
    }

    public async Task<CartItem?> GetItemAsync(int buyerId, int propertyId)
    {
        return await _context.CartItems
            .FirstOrDefaultAsync(c => c.BuyerId == buyerId && c.PropertyId == propertyId);
    }

    public async Task DeleteByBuyerAndPropertyAsync(int buyerId, int propertyId)
    {
        var item = await GetItemAsync(buyerId, propertyId);
        if (item != null)
        {
            await DeleteAsync(item);
        }
    }
}
