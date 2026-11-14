using EasyHousingSolution.SellerService.Application.DTOs;

namespace EasyHousingSolution.SellerService.Application.Interfaces;

public interface ISellerAppService
{
    Task<SellerResponseDto> CreateSellerAsync(CreateSellerDto dto);
    Task<SellerResponseDto?> GetSellerByIdAsync(int sellerId);
    Task<SellerResponseDto?> GetSellerByUserIdAsync(int userId);
    Task<SellerContactDto?> GetSellerContactAsync(int sellerId);
    Task<IEnumerable<SellerResponseDto>> GetAllSellersAsync();
}
