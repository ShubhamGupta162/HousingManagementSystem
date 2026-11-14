using EasyHousingSolution.SellerService.Application.DTOs;
using EasyHousingSolution.SellerService.Application.Interfaces;
using EasyHousingSolution.SellerService.Domain.Entities;
using EasyHousingSolution.SellerService.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace EasyHousingSolution.SellerService.Application.Services;

public class SellerAppService : ISellerAppService
{
    private readonly ISellerRepository _sellerRepository;
    private readonly ILogger<SellerAppService> _logger;

    public SellerAppService(ISellerRepository sellerRepository, ILogger<SellerAppService> logger)
    {
        _sellerRepository = sellerRepository;
        _logger = logger;
    }

    public async Task<SellerResponseDto> CreateSellerAsync(CreateSellerDto dto)
    {
        _logger.LogInformation("Creating seller profile for UserId {UserId}, Email {EmailId}", dto.UserId, dto.EmailId);
        var existing = await _sellerRepository.GetByEmailAsync(dto.EmailId);
        if (existing != null)
        {
            _logger.LogWarning("Seller creation aborted: email {EmailId} already exists", dto.EmailId);
            throw new InvalidOperationException("Seller profile already exists with this email.");
        }

        var seller = new Seller
        {
            UserId = dto.UserId,
            FullName = dto.FullName.Trim(),
            EmailId = dto.EmailId.Trim().ToLowerInvariant(),
            PhoneNo = dto.PhoneNo.Trim(),
            Address = dto.Address.Trim(),
            StateId = dto.StateId,
            CityId = dto.CityId
        };

        var created = await _sellerRepository.AddAsync(seller);
        return MapToResponse(created);
    }

    public async Task<SellerResponseDto?> GetSellerByIdAsync(int sellerId)
    {
        var seller = await _sellerRepository.GetByIdAsync(sellerId);
        return seller == null ? null : MapToResponse(seller);
    }

    public async Task<SellerResponseDto?> GetSellerByUserIdAsync(int userId)
    {
        var seller = await _sellerRepository.GetByUserIdAsync(userId);
        return seller == null ? null : MapToResponse(seller);
    }

    public async Task<SellerContactDto?> GetSellerContactAsync(int sellerId)
    {
        var seller = await _sellerRepository.GetByIdAsync(sellerId);
        if (seller == null) return null;

        return new SellerContactDto
        {
            SellerId = seller.SellerId,
            FullName = seller.FullName,
            EmailId = seller.EmailId,
            PhoneNo = seller.PhoneNo
        };
    }

    public async Task<IEnumerable<SellerResponseDto>> GetAllSellersAsync()
    {
        var sellers = await _sellerRepository.GetAllAsync();
        return sellers.Select(MapToResponse);
    }

    private static SellerResponseDto MapToResponse(Seller s) => new()
    {
        SellerId = s.SellerId,
        UserId = s.UserId,
        FullName = s.FullName,
        EmailId = s.EmailId,
        PhoneNo = s.PhoneNo,
        Address = s.Address,
        StateId = s.StateId,
        CityId = s.CityId
    };
}
