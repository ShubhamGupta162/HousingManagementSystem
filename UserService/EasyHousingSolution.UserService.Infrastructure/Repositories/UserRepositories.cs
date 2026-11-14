using Microsoft.EntityFrameworkCore;
using EasyHousingSolution.UserService.Domain.Entities;
using EasyHousingSolution.UserService.Domain.Interfaces;
using EasyHousingSolution.UserService.Infrastructure.Data;

namespace EasyHousingSolution.UserService.Infrastructure.Repositories;

public class BuyerRepository : IBuyerRepository
{
    private readonly UserDbContext _context;

    public BuyerRepository(UserDbContext context)
    {
        _context = context;
    }

    public async Task<Buyer?> GetByIdAsync(int buyerId)
    {
        return await _context.Buyers.FindAsync(buyerId);
    }

    public async Task<Buyer?> GetByEmailAsync(string emailId)
    {
        return await _context.Buyers.FirstOrDefaultAsync(b => b.EmailId.ToLower() == emailId.ToLower());
    }

    public async Task<Buyer?> GetByUserNameAsync(string userName)
    {
        return await _context.Buyers.FirstOrDefaultAsync(b => b.UserName.ToLower() == userName.ToLower()
                                                           || b.EmailId.ToLower() == userName.ToLower());
    }

    public async Task<IEnumerable<Buyer>> GetAllAsync()
    {
        return await _context.Buyers.ToListAsync();
    }

    public async Task<Buyer> AddAsync(Buyer buyer)
    {
        _context.Buyers.Add(buyer);
        await _context.SaveChangesAsync();
        return buyer;
    }

    public async Task UpdateAsync(Buyer buyer)
    {
        _context.Buyers.Update(buyer);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Buyer buyer)
    {
        _context.Buyers.Remove(buyer);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> ExistsAsync(string emailId)
    {
        return await _context.Buyers.AnyAsync(b => b.EmailId.ToLower() == emailId.ToLower());
    }
}

public class SellerRepository : ISellerRepository
{
    private readonly UserDbContext _context;

    public SellerRepository(UserDbContext context)
    {
        _context = context;
    }

    public async Task<Seller?> GetByIdAsync(int sellerId)
    {
        return await _context.Sellers.FindAsync(sellerId);
    }

    public async Task<Seller?> GetByEmailAsync(string emailId)
    {
        return await _context.Sellers.FirstOrDefaultAsync(s => s.EmailId.ToLower() == emailId.ToLower());
    }

    public async Task<Seller?> GetByUserNameAsync(string userName)
    {
        return await _context.Sellers.FirstOrDefaultAsync(s => s.UserName.ToLower() == userName.ToLower()
                                                            || s.EmailId.ToLower() == userName.ToLower());
    }

    public async Task<IEnumerable<Seller>> GetAllAsync()
    {
        return await _context.Sellers.ToListAsync();
    }

    public async Task<Seller> AddAsync(Seller seller)
    {
        _context.Sellers.Add(seller);
        await _context.SaveChangesAsync();
        return seller;
    }

    public async Task UpdateAsync(Seller seller)
    {
        _context.Sellers.Update(seller);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Seller seller)
    {
        _context.Sellers.Remove(seller);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> ExistsAsync(string emailId)
    {
        return await _context.Sellers.AnyAsync(s => s.EmailId.ToLower() == emailId.ToLower());
    }
}
