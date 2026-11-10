using EasyHousingSolution.IdentityService.Application.DTOs;
using EasyHousingSolution.IdentityService.Application.Interfaces;
using EasyHousingSolution.IdentityService.Domain.Entities;
using EasyHousingSolution.IdentityService.Domain.Interfaces;
using EasyHousingSolution.Shared.Security;

namespace EasyHousingSolution.IdentityService.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IBuyerRepository _buyerRepository;
    private readonly ISellerRepository _sellerRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthService(
        IUserRepository userRepository,
        IBuyerRepository buyerRepository,
        ISellerRepository sellerRepository,
        IJwtTokenGenerator jwtTokenGenerator)
    {
        _userRepository = userRepository;
        _buyerRepository = buyerRepository;
        _sellerRepository = sellerRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<AuthResponseDto> RegisterBuyerAsync(RegisterBuyerDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.EmailId) || string.IsNullOrWhiteSpace(dto.Password))
        {
            throw new ArgumentException("Email and password are required.");
        }

        if (await _userRepository.ExistsAsync(dto.EmailId))
        {
            throw new InvalidOperationException($"A user with email '{dto.EmailId}' already exists.");
        }

        var user = new User
        {
            UserName = dto.EmailId.Trim().ToLowerInvariant(),
            Password = PasswordSecurity.HashPassword(dto.Password),
            UserType = "Buyer"
        };
        await _userRepository.AddUserAsync(user);

        var buyer = new Buyer
        {
            EmailId = user.UserName,
            FullName = dto.FullName.Trim(),
            PhoneNo = dto.PhoneNo.Trim()
        };
        var createdBuyer = await _buyerRepository.AddAsync(buyer);

        var token = _jwtTokenGenerator.GenerateToken(user.UserName, user.UserType, createdBuyer.BuyerId);

        return new AuthResponseDto
        {
            Token = token,
            EmailId = user.UserName,
            UserType = user.UserType,
            FullName = buyer.FullName,
            ProfileId = createdBuyer.BuyerId
        };
    }

    public async Task<AuthResponseDto> RegisterSellerAsync(RegisterSellerDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.EmailId) || string.IsNullOrWhiteSpace(dto.Password))
        {
            throw new ArgumentException("Email and password are required.");
        }

        if (await _userRepository.ExistsAsync(dto.EmailId))
        {
            throw new InvalidOperationException($"A user with email '{dto.EmailId}' already exists.");
        }

        var user = new User
        {
            UserName = dto.EmailId.Trim().ToLowerInvariant(),
            Password = PasswordSecurity.HashPassword(dto.Password),
            UserType = "Seller"
        };
        await _userRepository.AddUserAsync(user);

        var seller = new Seller
        {
            EmailId = user.UserName,
            FullName = dto.FullName.Trim(),
            PhoneNo = dto.PhoneNo.Trim(),
            Address = dto.Address.Trim(),
            StateId = dto.StateId,
            CityId = dto.CityId
        };
        var createdSeller = await _sellerRepository.AddAsync(seller);

        var token = _jwtTokenGenerator.GenerateToken(user.UserName, user.UserType, createdSeller.SellerId);

        return new AuthResponseDto
        {
            Token = token,
            EmailId = user.UserName,
            UserType = user.UserType,
            FullName = seller.FullName,
            ProfileId = createdSeller.SellerId
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

        int? profileId = null;
        string fullName = user.UserName;

        if (user.UserType == "Buyer")
        {
            var buyer = await _buyerRepository.GetByEmailAsync(user.UserName);
            if (buyer != null)
            {
                profileId = buyer.BuyerId;
                fullName = buyer.FullName;
            }
        }
        else if (user.UserType == "Seller")
        {
            var seller = await _sellerRepository.GetByEmailAsync(user.UserName);
            if (seller != null)
            {
                profileId = seller.SellerId;
                fullName = seller.FullName;
            }
        }

        var token = _jwtTokenGenerator.GenerateToken(user.UserName, user.UserType, profileId);

        return new AuthResponseDto
        {
            Token = token,
            EmailId = user.UserName,
            UserType = user.UserType,
            FullName = fullName,
            ProfileId = profileId
        };
    }

    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllUsersAsync();
        return users.Select(u => new UserDto
        {
            UserName = u.UserName,
            UserType = u.UserType
        });
    }

    public async Task<UserDto?> GetUserByUsernameAsync(string username)
    {
        var user = await _userRepository.GetByUserNameAsync(username.Trim().ToLowerInvariant());
        if (user == null) return null;

        return new UserDto
        {
            UserName = user.UserName,
            UserType = user.UserType
        };
    }
}
