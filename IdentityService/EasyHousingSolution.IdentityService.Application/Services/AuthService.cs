using System.Net.Http.Json;
using EasyHousingSolution.IdentityService.Application.DTOs;
using EasyHousingSolution.IdentityService.Application.Interfaces;
using EasyHousingSolution.IdentityService.Domain.Entities;
using EasyHousingSolution.IdentityService.Domain.Interfaces;
using EasyHousingSolution.Shared.Common;
using EasyHousingSolution.Shared.Security;

namespace EasyHousingSolution.IdentityService.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly HttpClient _httpClient;

    public AuthService(
        IUserRepository userRepository,
        IJwtTokenGenerator jwtTokenGenerator,
        HttpClient httpClient)
    {
        _userRepository = userRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
        _httpClient = httpClient;
    }

    public async Task<AuthResponseDto> RegisterBuyerAsync(RegisterBuyerDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.EmailId) || string.IsNullOrWhiteSpace(dto.Password))
        {
            throw new ArgumentException("Email and password are required.");
        }

        var normalizedEmail = dto.EmailId.Trim().ToLowerInvariant();

        if (await _userRepository.ExistsAsync(normalizedEmail))
        {
            throw new InvalidOperationException($"A user with email '{dto.EmailId}' already exists.");
        }

        var user = new User
        {
            UserName = normalizedEmail,
            Password = PasswordSecurity.HashPassword(dto.Password),
            UserType = "Buyer",
            FullName = dto.FullName.Trim(),
            PhoneNo = dto.PhoneNo.Trim()
        };

        int? buyerId = null;
        try
        {
            var buyerPayload = new
            {
                userId = 0,
                fullName = user.FullName,
                emailId = user.UserName,
                phoneNo = user.PhoneNo
            };
            var response = await _httpClient.PostAsJsonAsync("http://localhost:5003/api/buyers", buyerPayload);
            if (response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadFromJsonAsync<ApiResponse<Dictionary<string, object>>>();
                if (body?.Data != null && body.Data.TryGetValue("buyerId", out var idObj))
                {
                    buyerId = Convert.ToInt32(idObj.ToString());
                }
            }
        }
        catch
        {
            // Fallback gracefully
        }

        user.ProfileId = buyerId;
        await _userRepository.AddUserAsync(user);

        var token = _jwtTokenGenerator.GenerateToken(user.UserName, user.UserType, buyerId);

        return new AuthResponseDto
        {
            Token = token,
            EmailId = user.UserName,
            UserType = user.UserType,
            FullName = user.FullName,
            ProfileId = buyerId
        };
    }

    public async Task<AuthResponseDto> RegisterSellerAsync(RegisterSellerDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.EmailId) || string.IsNullOrWhiteSpace(dto.Password))
        {
            throw new ArgumentException("Email and password are required.");
        }

        var normalizedEmail = dto.EmailId.Trim().ToLowerInvariant();

        if (await _userRepository.ExistsAsync(normalizedEmail))
        {
            throw new InvalidOperationException($"A user with email '{dto.EmailId}' already exists.");
        }

        var user = new User
        {
            UserName = normalizedEmail,
            Password = PasswordSecurity.HashPassword(dto.Password),
            UserType = "Seller",
            FullName = dto.FullName.Trim(),
            PhoneNo = dto.PhoneNo.Trim()
        };

        int? sellerId = null;
        try
        {
            var sellerPayload = new
            {
                userId = 0,
                fullName = user.FullName,
                emailId = user.UserName,
                phoneNo = user.PhoneNo,
                address = dto.Address.Trim(),
                stateId = dto.StateId,
                cityId = dto.CityId
            };
            var response = await _httpClient.PostAsJsonAsync("http://localhost:5004/api/sellers", sellerPayload);
            if (response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadFromJsonAsync<ApiResponse<Dictionary<string, object>>>();
                if (body?.Data != null && body.Data.TryGetValue("sellerId", out var idObj))
                {
                    sellerId = Convert.ToInt32(idObj.ToString());
                }
            }
        }
        catch
        {
            // Fallback gracefully
        }

        user.ProfileId = sellerId;
        await _userRepository.AddUserAsync(user);

        var token = _jwtTokenGenerator.GenerateToken(user.UserName, user.UserType, sellerId);

        return new AuthResponseDto
        {
            Token = token,
            EmailId = user.UserName,
            UserType = user.UserType,
            FullName = user.FullName,
            ProfileId = sellerId
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var normalizedEmail = dto.EmailId.Trim().ToLowerInvariant();
        var user = await _userRepository.GetByUserNameAsync(normalizedEmail);

        if (user == null || !PasswordSecurity.VerifyPassword(dto.Password, user.Password))
        {
            throw new ArgumentException("Invalid email or password.");
        }

        var token = _jwtTokenGenerator.GenerateToken(user.UserName, user.UserType, user.ProfileId);

        return new AuthResponseDto
        {
            Token = token,
            EmailId = user.UserName,
            UserType = user.UserType,
            FullName = string.IsNullOrWhiteSpace(user.FullName) ? user.UserName : user.FullName,
            ProfileId = user.ProfileId
        };
    }

    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllUsersAsync();
        return users.Select(u => new UserDto
        {
            UserName = u.UserName,
            EmailId = u.UserName,
            UserType = u.UserType,
            FullName = u.FullName,
            PhoneNo = u.PhoneNo,
            ProfileId = u.ProfileId
        });
    }

    public async Task<UserDto?> GetUserByUsernameAsync(string username)
    {
        var user = await _userRepository.GetByUserNameAsync(username.Trim().ToLowerInvariant());
        if (user == null) return null;

        return new UserDto
        {
            UserName = user.UserName,
            EmailId = user.UserName,
            UserType = user.UserType,
            FullName = user.FullName,
            PhoneNo = user.PhoneNo,
            ProfileId = user.ProfileId
        };
    }
}
