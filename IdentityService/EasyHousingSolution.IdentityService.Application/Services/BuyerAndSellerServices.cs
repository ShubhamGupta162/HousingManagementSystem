using EasyHousingSolution.IdentityService.Application.DTOs;
using EasyHousingSolution.IdentityService.Application.Interfaces;
using EasyHousingSolution.IdentityService.Domain.Entities;
using EasyHousingSolution.IdentityService.Domain.Interfaces;

namespace EasyHousingSolution.IdentityService.Application.Services;

public class BuyerService : IBuyerService
{
    private readonly IBuyerRepository _buyerRepository;

    public BuyerService(IBuyerRepository buyerRepository)
    {
        _buyerRepository = buyerRepository;
    }

    public async Task<IEnumerable<BuyerDto>> GetAllBuyersAsync()
    {
        var list = await _buyerRepository.GetAllAsync();
        return list.Select(b => new BuyerDto
        {
            BuyerId = b.BuyerId,
            EmailId = b.EmailId,
            FullName = b.FullName,
            PhoneNo = b.PhoneNo
        });
    }

    public async Task<BuyerDto?> GetBuyerByIdAsync(int id)
    {
        var b = await _buyerRepository.GetByIdAsync(id);
        if (b == null) return null;

        return new BuyerDto
        {
            BuyerId = b.BuyerId,
            EmailId = b.EmailId,
            FullName = b.FullName,
            PhoneNo = b.PhoneNo
        };
    }

    public async Task<BuyerDto?> GetBuyerByEmailAsync(string email)
    {
        var b = await _buyerRepository.GetByEmailAsync(email);
        if (b == null) return null;

        return new BuyerDto
        {
            BuyerId = b.BuyerId,
            EmailId = b.EmailId,
            FullName = b.FullName,
            PhoneNo = b.PhoneNo
        };
    }

    public async Task<BuyerDto> UpdateBuyerAsync(int id, BuyerDto dto)
    {
        var existing = await _buyerRepository.GetByIdAsync(id);
        if (existing == null)
        {
            throw new KeyNotFoundException($"Buyer with ID {id} not found.");
        }

        existing.FullName = dto.FullName.Trim();
        existing.PhoneNo = dto.PhoneNo.Trim();

        await _buyerRepository.UpdateAsync(existing);

        return new BuyerDto
        {
            BuyerId = existing.BuyerId,
            EmailId = existing.EmailId,
            FullName = existing.FullName,
            PhoneNo = existing.PhoneNo
        };
    }

    public async Task DeleteBuyerAsync(int id)
    {
        await _buyerRepository.DeleteByIdAsync(id);
    }
}

public class SellerService : ISellerService
{
    private readonly ISellerRepository _sellerRepository;

    public SellerService(ISellerRepository sellerRepository)
    {
        _sellerRepository = sellerRepository;
    }

    public async Task<IEnumerable<SellerDto>> GetAllSellersAsync()
    {
        var list = await _sellerRepository.GetAllAsync();
        return list.Select(s => new SellerDto
        {
            SellerId = s.SellerId,
            EmailId = s.EmailId,
            FullName = s.FullName,
            PhoneNo = s.PhoneNo,
            Address = s.Address,
            StateId = s.StateId,
            CityId = s.CityId
        });
    }

    public async Task<SellerDto?> GetSellerByIdAsync(int id)
    {
        var s = await _sellerRepository.GetByIdAsync(id);
        if (s == null) return null;

        return new SellerDto
        {
            SellerId = s.SellerId,
            EmailId = s.EmailId,
            FullName = s.FullName,
            PhoneNo = s.PhoneNo,
            Address = s.Address,
            StateId = s.StateId,
            CityId = s.CityId
        };
    }

    public async Task<SellerDto?> GetSellerByEmailAsync(string email)
    {
        var s = await _sellerRepository.GetByEmailAsync(email);
        if (s == null) return null;

        return new SellerDto
        {
            SellerId = s.SellerId,
            EmailId = s.EmailId,
            FullName = s.FullName,
            PhoneNo = s.PhoneNo,
            Address = s.Address,
            StateId = s.StateId,
            CityId = s.CityId
        };
    }

    public async Task<SellerContactDto?> GetSellerContactAsync(int id)
    {
        var s = await _sellerRepository.GetByIdAsync(id);
        if (s == null) return null;

        return new SellerContactDto
        {
            SellerId = s.SellerId,
            FullName = s.FullName,
            EmailId = s.EmailId,
            PhoneNo = s.PhoneNo
        };
    }

    public async Task<SellerDto> UpdateSellerAsync(int id, SellerDto dto)
    {
        var existing = await _sellerRepository.GetByIdAsync(id);
        if (existing == null)
        {
            throw new KeyNotFoundException($"Seller with ID {id} not found.");
        }

        existing.FullName = dto.FullName.Trim();
        existing.PhoneNo = dto.PhoneNo.Trim();
        existing.Address = dto.Address.Trim();
        existing.StateId = dto.StateId;
        existing.CityId = dto.CityId;

        await _sellerRepository.UpdateAsync(existing);

        return new SellerDto
        {
            SellerId = existing.SellerId,
            EmailId = existing.EmailId,
            FullName = existing.FullName,
            PhoneNo = existing.PhoneNo,
            Address = existing.Address,
            StateId = existing.StateId,
            CityId = existing.CityId
        };
    }

    public async Task DeleteSellerAsync(int id)
    {
        await _sellerRepository.DeleteByIdAsync(id);
    }
}
