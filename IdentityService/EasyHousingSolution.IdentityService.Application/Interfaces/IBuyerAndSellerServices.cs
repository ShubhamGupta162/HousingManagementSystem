using EasyHousingSolution.IdentityService.Application.DTOs;

namespace EasyHousingSolution.IdentityService.Application.Interfaces;

public interface IBuyerService
{
    Task<IEnumerable<BuyerDto>> GetAllBuyersAsync();
    Task<BuyerDto?> GetBuyerByIdAsync(int id);
    Task<BuyerDto?> GetBuyerByEmailAsync(string email);
    Task<BuyerDto> UpdateBuyerAsync(int id, BuyerDto dto);
    Task DeleteBuyerAsync(int id);
}

public interface ISellerService
{
    Task<IEnumerable<SellerDto>> GetAllSellersAsync();
    Task<SellerDto?> GetSellerByIdAsync(int id);
    Task<SellerDto?> GetSellerByEmailAsync(string email);
    Task<SellerContactDto?> GetSellerContactAsync(int id);
    Task<SellerDto> UpdateSellerAsync(int id, SellerDto dto);
    Task DeleteSellerAsync(int id);
}
