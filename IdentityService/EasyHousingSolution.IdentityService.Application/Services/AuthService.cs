using System.Net.Http.Json;
using EasyHousingSolution.IdentityService.Application.DTOs;
using EasyHousingSolution.IdentityService.Application.Interfaces;
using EasyHousingSolution.IdentityService.Domain.Entities;
using EasyHousingSolution.IdentityService.Domain.Interfaces;
using EasyHousingSolution.Shared.Common;
using EasyHousingSolution.Shared.Security;
using Microsoft.Extensions.Logging;

namespace EasyHousingSolution.IdentityService.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly HttpClient _httpClient;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IUserRepository userRepository,
        IJwtTokenGenerator jwtTokenGenerator,
        HttpClient httpClient,
        ILogger<AuthService> logger)
    {
        _userRepository = userRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<AuthResponseDto> RegisterBuyerAsync(RegisterBuyerDto dto)
    {
        var email = dto.EmailId?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(dto.Password))
        {
            throw new ArgumentException("Email and password are required.");
        }

        var birthDate = dto.GetParsedDateOfBirth();
        var today = DateTime.UtcNow.Date;
        if (birthDate > today)
        {
            throw new ArgumentException("Date of birth cannot be in the future.");
        }
        var age = today.Year - birthDate.Year;
        if (birthDate.Date > today.AddYears(-age)) age--;
        if (age < 18)
        {
            throw new InvalidOperationException("Buyer must be at least 18 years old to register.");
        }

        var normalizedEmail = email.ToLowerInvariant();

        if (await _userRepository.ExistsAsync(normalizedEmail))
        {
            throw new InvalidOperationException($"A user with email '{email}' already exists.");
        }

        var fullName = string.IsNullOrWhiteSpace(dto.FullName) ? "Buyer" : dto.FullName.Trim();
        var nameParts = fullName.Split(' ', 2);
        var firstName = nameParts[0];
        var lastName = nameParts.Length > 1 ? nameParts[1] : null;
        var phone = dto.MobileNo.Trim();

        var user = new User
        {
            UserName = normalizedEmail,
            Password = dto.Password,
            UserType = "Buyer",
            FullName = fullName,
            PhoneNo = phone
        };

        int? buyerId = null;
        try
        {
            var buyerPayload = new
            {
                firstName = firstName,
                lastName = lastName,
                dateOfBirth = birthDate,
                phoneNo = phone,
                emailId = user.UserName,
                userName = user.UserName
            };
            var response = await _httpClient.PostAsJsonAsync("api/buyers", buyerPayload);
            if (response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
                if (body != null && body.TryGetValue("buyerId", out var idObj))
                {
                    buyerId = Convert.ToInt32(idObj.ToString());
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to provision buyer profile in UserService for user {UserName}. Continuing with fallback ProfileId", user.UserName);
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

        var birthDate = dto.GetParsedDateOfBirth();
        var today = DateTime.UtcNow.Date;
        if (birthDate > today)
        {
            throw new ArgumentException("Date of birth cannot be in the future.");
        }
        var age = today.Year - birthDate.Year;
        if (birthDate.Date > today.AddYears(-age)) age--;
        if (age < 18)
        {
            throw new InvalidOperationException("Seller must be at least 18 years old to register.");
        }

        var normalizedEmail = dto.EmailId.Trim().ToLowerInvariant();

        if (await _userRepository.ExistsAsync(normalizedEmail))
        {
            throw new InvalidOperationException($"A user with email '{dto.EmailId}' already exists.");
        }

        var firstName = !string.IsNullOrWhiteSpace(dto.FirstName)
            ? dto.FirstName.Trim()
            : (dto.FullName.Split(' ').FirstOrDefault() ?? "Seller");
        var lastName = !string.IsNullOrWhiteSpace(dto.LastName)
            ? dto.LastName.Trim()
            : (dto.FullName.Contains(' ') ? dto.FullName.Substring(dto.FullName.IndexOf(' ') + 1).Trim() : null);
        var fullName = string.IsNullOrWhiteSpace(dto.FullName)
            ? (string.IsNullOrWhiteSpace(lastName) ? firstName : $"{firstName} {lastName}".Trim())
            : dto.FullName.Trim();

        var user = new User
        {
            UserName = normalizedEmail,
            Password = dto.Password,
            UserType = "Seller",
            FullName = fullName,
            PhoneNo = dto.PhoneNo.Trim()
        };

        int? sellerId = null;
        try
        {
            var sellerPayload = new
            {
                userName = user.UserName,
                firstName = firstName,
                lastName = lastName,
                dateofBirth = birthDate,
                phoneNo = user.PhoneNo,
                address = dto.Address.Trim(),
                stateId = dto.StateId,
                cityId = dto.CityId,
                emailId = user.UserName
            };
            var response = await _httpClient.PostAsJsonAsync("api/sellers", sellerPayload);
            if (response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
                if (body != null && body.TryGetValue("sellerId", out var idObj))
                {
                    sellerId = Convert.ToInt32(idObj.ToString());
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to provision buyer profile in UserService for user {UserName}. Continuing with fallback ProfileId", user.UserName);
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

        if (user == null || (user.Password != dto.Password && !PasswordSecurity.VerifyPassword(dto.Password, user.Password)))
        {
            throw new ArgumentException("Invalid email or password.");
        }

        var profileId = user.ProfileId;
        if (!profileId.HasValue || profileId.Value <= 0)
        {
            if (user.UserType == "Seller" || user.UserType == "Buyer")
            {
                profileId = 1;
            }
        }

        var token = _jwtTokenGenerator.GenerateToken(user.UserName, user.UserType, profileId);

        return new AuthResponseDto
        {
            Token = token,
            EmailId = user.UserName,
            UserType = user.UserType,
            FullName = string.IsNullOrWhiteSpace(user.FullName) ? user.UserName : user.FullName,
            ProfileId = profileId
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
            FullName = u.FullName ?? string.Empty,
            PhoneNo = u.PhoneNo ?? string.Empty,
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
            FullName = user.FullName ?? string.Empty,
            PhoneNo = user.PhoneNo ?? string.Empty,
            ProfileId = user.ProfileId
        };
    }
}
