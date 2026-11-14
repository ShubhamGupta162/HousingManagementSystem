using EasyHousingSolution.UserService.Application.DTOs;

namespace EasyHousingSolution.UserService.Application.Interfaces;

public interface IBuyerAppService
{
    Task<BuyerResponseDto> CreateBuyerAsync(CreateBuyerDto dto);
    Task<BuyerResponseDto?> GetBuyerByIdAsync(int buyerId);
    Task<BuyerResponseDto?> GetBuyerByEmailAsync(string emailId);
    Task<BuyerResponseDto?> GetBuyerByUserNameAsync(string userName);
    Task<IEnumerable<BuyerResponseDto>> GetAllBuyersAsync();
    Task<BuyerResponseDto?> UpdateBuyerProfileAsync(int buyerId, UpdateBuyerProfileDto dto);
    Task<bool> DeleteBuyerAsync(int buyerId);
}

public interface ISellerAppService
{
    Task<SellerResponseDto> CreateSellerAsync(CreateSellerDto dto);
    Task<SellerResponseDto?> GetSellerByIdAsync(int sellerId);
    Task<SellerResponseDto?> GetSellerByEmailAsync(string emailId);
    Task<SellerResponseDto?> GetSellerByUserNameAsync(string userName);
    Task<SellerContactDto?> GetSellerContactAsync(int sellerId);
    Task<IEnumerable<SellerResponseDto>> GetAllSellersAsync();
    Task<SellerResponseDto?> UpdateSellerProfileAsync(int sellerId, UpdateSellerProfileDto dto);
    Task<bool> DeleteSellerAsync(int sellerId);
}

public interface IUserAppService
{
    Task<IEnumerable<UserSummaryDto>> GetAllUsersAsync(string? role = null, bool? isActive = null);
    Task<UserSummaryDto?> GetUserByIdAsync(int userId);
    Task<UserSummaryDto?> GetUserByUserNameAsync(string userName);
    Task<bool> UpdateUserStatusAsync(int userId, bool isActive, string? reason);
    Task<bool> DeleteUserAsync(int userId);
}
