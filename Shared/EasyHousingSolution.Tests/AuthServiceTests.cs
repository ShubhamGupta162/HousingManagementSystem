using EasyHousingSolution.IdentityService.Application.DTOs;
using EasyHousingSolution.IdentityService.Application.Interfaces;
using EasyHousingSolution.IdentityService.Application.Services;
using EasyHousingSolution.IdentityService.Domain.Entities;
using EasyHousingSolution.IdentityService.Domain.Interfaces;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;

namespace EasyHousingSolution.Tests.Services;

[TestFixture]
public class AuthServiceTests
{
    private Mock<IUserRepository> _mockUserRepo = null!;
    private Mock<IJwtTokenGenerator> _mockJwtGenerator = null!;
    private Mock<ILogger<AuthService>> _mockLogger = null!;
    private AuthService _authService = null!;

    [SetUp]
    public void Setup()
    {
        _mockUserRepo = new Mock<IUserRepository>();
        _mockJwtGenerator = new Mock<IJwtTokenGenerator>();
        _mockLogger = new Mock<ILogger<AuthService>>();

        var httpClient = new HttpClient(); // dummy client for unit tests
        _authService = new AuthService(
            _mockUserRepo.Object,
            _mockJwtGenerator.Object,
            httpClient,
            _mockLogger.Object
        );
    }

    [Test]
    public async Task RegisterBuyerAsync_WhenValidBuyer_SavesUserWithBuyerType()
    {
        // Arrange
        var dto = new RegisterBuyerDto
        {
            FullName = "Kavita Rao",
            EmailId = "kavita.rao@example.com",
            Password = "Password123!",
            Dob = "15-08-1995",
            MobileNo = "9823456789"
        };

        _mockUserRepo.Setup(r => r.ExistsAsync("kavita.rao@example.com")).ReturnsAsync(false);
        _mockUserRepo.Setup(r => r.AddUserAsync(It.IsAny<User>())).Returns(Task.CompletedTask);
        _mockJwtGenerator.Setup(g => g.GenerateToken("kavita.rao@example.com", "Buyer", It.IsAny<int?>()))
            .Returns("fake-buyer-jwt");

        // Act
        var result = await _authService.RegisterBuyerAsync(dto);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.UserType, Is.EqualTo("Buyer"));
        Assert.That(result.EmailId, Is.EqualTo("kavita.rao@example.com"));
        Assert.That(result.Token, Is.EqualTo("fake-buyer-jwt"));

        _mockUserRepo.Verify(r => r.AddUserAsync(It.Is<User>(u =>
            u.UserName == "kavita.rao@example.com" &&
            u.UserType == "Buyer" &&
            u.Password == "Password123!"
        )), Times.Once);
    }

    [Test]
    public void RegisterBuyerAsync_WhenUnderageBuyer_ThrowsInvalidOperationException()
    {
        // Arrange: DOB is 15 years ago
        var underAgeDob = DateTime.UtcNow.AddYears(-15).ToString("dd-MM-yyyy");
        var dto = new RegisterBuyerDto
        {
            FullName = "Young Kid",
            EmailId = "kid@example.com",
            Password = "Password123!",
            Dob = underAgeDob,
            MobileNo = "8823456789"
        };

        // Act & Assert
        Assert.ThrowsAsync<InvalidOperationException>(async () =>
        {
            await _authService.RegisterBuyerAsync(dto);
        });
    }

    [Test]
    public async Task RegisterSellerAsync_WhenValidSeller_SavesUserWithSellerType()
    {
        // Arrange
        var dto = new RegisterSellerDto
        {
            FullName = "Ramesh Verma",
            FirstName = "Ramesh",
            LastName = "Verma",
            EmailId = "ramesh@seller.com",
            Password = "Password123!",
            Dob = "10-04-1988",
            PhoneNo = "9871234560",
            Address = "14 MG Road",
            StateId = 1,
            CityId = 1
        };

        _mockUserRepo.Setup(r => r.ExistsAsync("ramesh@seller.com")).ReturnsAsync(false);
        _mockUserRepo.Setup(r => r.AddUserAsync(It.IsAny<User>())).Returns(Task.CompletedTask);
        _mockJwtGenerator.Setup(g => g.GenerateToken("ramesh@seller.com", "Seller", It.IsAny<int?>()))
            .Returns("fake-seller-jwt");

        // Act
        var result = await _authService.RegisterSellerAsync(dto);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.UserType, Is.EqualTo("Seller"));
        Assert.That(result.EmailId, Is.EqualTo("ramesh@seller.com"));
        Assert.That(result.Token, Is.EqualTo("fake-seller-jwt"));

        _mockUserRepo.Verify(r => r.AddUserAsync(It.Is<User>(u =>
            u.UserName == "ramesh@seller.com" &&
            u.UserType == "Seller"
        )), Times.Once);
    }

    [Test]
    public async Task LoginAsync_WhenAdminCredentials_ReturnsAdminRoleToken()
    {
        // Arrange
        var adminUser = new User
        {
            UserName = "admin@easysolution.com",
            Password = "AdminPassword123!",
            UserType = "Admin"
        };

        _mockUserRepo.Setup(r => r.GetByUserNameAsync("admin@easysolution.com")).ReturnsAsync(adminUser);
        _mockJwtGenerator.Setup(g => g.GenerateToken("admin@easysolution.com", "Admin", null))
            .Returns("fake-admin-jwt");

        var loginDto = new LoginDto
        {
            EmailId = "admin@easysolution.com",
            Password = "AdminPassword123!"
        };

        // Act
        var result = await _authService.LoginAsync(loginDto);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.UserType, Is.EqualTo("Admin"));
        Assert.That(result.EmailId, Is.EqualTo("admin@easysolution.com"));
        Assert.That(result.Token, Is.EqualTo("fake-admin-jwt"));
    }

    [Test]
    public void LoginAsync_WhenInvalidPassword_ThrowsArgumentException()
    {
        // Arrange
        var user = new User
        {
            UserName = "buyer@demo.com",
            Password = "CorrectPassword123!",
            UserType = "Buyer"
        };

        _mockUserRepo.Setup(r => r.GetByUserNameAsync("buyer@demo.com")).ReturnsAsync(user);

        var loginDto = new LoginDto
        {
            EmailId = "buyer@demo.com",
            Password = "WrongPassword!"
        };

        // Act & Assert
        Assert.ThrowsAsync<ArgumentException>(async () =>
        {
            await _authService.LoginAsync(loginDto);
        });
    }

    [Test]
    public void LoginAsync_WhenUserDoesNotExist_ThrowsArgumentException()
    {
        // Arrange
        _mockUserRepo.Setup(r => r.GetByUserNameAsync("nonexistent@demo.com")).ReturnsAsync((User?)null);

        var loginDto = new LoginDto
        {
            EmailId = "nonexistent@demo.com",
            Password = "AnyPassword123!"
        };

        // Act & Assert
        Assert.ThrowsAsync<ArgumentException>(async () =>
        {
            await _authService.LoginAsync(loginDto);
        });
    }
}
