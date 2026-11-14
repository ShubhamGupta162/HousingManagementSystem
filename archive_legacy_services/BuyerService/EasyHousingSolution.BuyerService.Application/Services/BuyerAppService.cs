using EasyHousingSolution.BuyerService.Application.DTOs;
using EasyHousingSolution.BuyerService.Application.Interfaces;
using EasyHousingSolution.BuyerService.Domain.Entities;
using EasyHousingSolution.BuyerService.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace EasyHousingSolution.BuyerService.Application.Services;

public class BuyerAppService : IBuyerAppService
{
    private readonly IBuyerRepository _buyerRepository;
    private readonly ILogger<BuyerAppService> _logger;

    public BuyerAppService(IBuyerRepository buyerRepository, ILogger<BuyerAppService> logger)
    {
        _buyerRepository = buyerRepository;
        _logger = logger;
    }

    public async Task<BuyerResponseDto> CreateBuyerAsync(CreateBuyerDto dto)
    {
        _logger.LogInformation("Creating buyer profile for UserId {UserId}, Email {EmailId}", dto.UserId, dto.EmailId);
        var existing = await _buyerRepository.GetByEmailAsync(dto.EmailId);
        if (existing != null)
        {
            _logger.LogWarning("Buyer creation aborted: email {EmailId} already exists", dto.EmailId);
            throw new InvalidOperationException("Buyer profile already exists with this email.");
        }

        var buyer = new Buyer
        {
            UserId = dto.UserId,
            FullName = dto.FullName.Trim(),
            EmailId = dto.EmailId.Trim().ToLowerInvariant(),
            PhoneNo = dto.PhoneNo.Trim()
        };

        var created = await _buyerRepository.AddAsync(buyer);
        return MapToResponse(created);
    }

    public async Task<BuyerResponseDto?> GetBuyerByIdAsync(int buyerId)
    {
        var buyer = await _buyerRepository.GetByIdAsync(buyerId);
        return buyer == null ? null : MapToResponse(buyer);
    }

    public async Task<BuyerResponseDto?> GetBuyerByUserIdAsync(int userId)
    {
        var buyer = await _buyerRepository.GetByUserIdAsync(userId);
        return buyer == null ? null : MapToResponse(buyer);
    }

    public async Task<IEnumerable<BuyerResponseDto>> GetAllBuyersAsync()
    {
        var buyers = await _buyerRepository.GetAllAsync();
        return buyers.Select(MapToResponse);
    }

    private static BuyerResponseDto MapToResponse(Buyer b) => new()
    {
        BuyerId = b.BuyerId,
        UserId = b.UserId,
        FullName = b.FullName,
        EmailId = b.EmailId,
        PhoneNo = b.PhoneNo
    };
}
