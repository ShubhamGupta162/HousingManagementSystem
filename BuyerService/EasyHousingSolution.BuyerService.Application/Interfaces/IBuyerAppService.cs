using EasyHousingSolution.BuyerService.Application.DTOs;

namespace EasyHousingSolution.BuyerService.Application.Interfaces;

public interface IBuyerAppService
{
    Task<BuyerResponseDto> CreateBuyerAsync(CreateBuyerDto dto);
    Task<BuyerResponseDto?> GetBuyerByIdAsync(int buyerId);
    Task<BuyerResponseDto?> GetBuyerByUserIdAsync(int userId);
    Task<IEnumerable<BuyerResponseDto>> GetAllBuyersAsync();
}
