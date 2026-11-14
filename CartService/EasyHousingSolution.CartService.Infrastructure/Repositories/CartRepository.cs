using Microsoft.EntityFrameworkCore;
using EasyHousingSolution.CartService.Domain.Entities;
using EasyHousingSolution.CartService.Domain.Interfaces;
using EasyHousingSolution.CartService.Infrastructure.Data;

namespace EasyHousingSolution.CartService.Infrastructure.Repositories;

public class CartRepository : ICartRepository
{
    private readonly CartDbContext _context;

    public CartRepository(CartDbContext context)
    {
        _context = context;
    }

    public async Task<CartItem?> GetByIdAsync(int cartId)
    {
        return await _context.CartItems.FindAsync(cartId);
    }

    public async Task<IEnumerable<CartItem>> GetByBuyerIdAsync(int buyerId)
    {
        return await _context.CartItems.Where(c => c.BuyerId == buyerId).ToListAsync();
    }

    public async Task<CartItem> AddAsync(CartItem item)
    {
        _context.CartItems.Add(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task<bool> RemoveAsync(int cartId)
    {
        var item = await _context.CartItems.FindAsync(cartId);
        if (item == null) return false;

        _context.CartItems.Remove(item);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsAsync(int buyerId, int propertyId)
    {
        return await _context.CartItems.AnyAsync(c => c.BuyerId == buyerId && c.PropertyId == propertyId);
    }

    public async Task<bool> ClearBuyerCartAsync(int buyerId)
    {
        var items = await _context.CartItems.Where(c => c.BuyerId == buyerId).ToListAsync();
        if (!items.Any()) return false;

        _context.CartItems.RemoveRange(items);
        await _context.SaveChangesAsync();
        return true;
    }
}
