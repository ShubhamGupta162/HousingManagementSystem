using NUnit.Framework;
using Moq;
using EasyHousingSolution.UserService.Application.DTOs;
using EasyHousingSolution.UserService.Application.Services;
using EasyHousingSolution.UserService.Domain.Entities;
using EasyHousingSolution.UserService.Domain.Interfaces;

namespace EasyHousingSolution.Tests.Services;

[TestFixture]
public class BuyerServiceTests
{
    private Mock<IBuyerRepository> _mockBuyerRepository = null!;
    private BuyerAppService _buyerService = null!;

    [SetUp]
    public void Setup()
    {
        // 1. Arrange: Create a mock repository
        _mockBuyerRepository = new Mock<IBuyerRepository>();

        // 2. Initialize the service with the mocked repository
        _buyerService = new BuyerAppService(_mockBuyerRepository.Object);
    }

    [Test]
    public async Task GetBuyerByIdAsync_WhenBuyerExists_ReturnsBuyerDto()
    {
        // Arrange
        var fakeBuyer = new Buyer
        {
            BuyerId = 1,
            FirstName = "Rajesh",
            LastName = "Sharma",
            EmailId = "rajesh.sharma@example.com",
            PhoneNo = "9876543210"
        };

        _mockBuyerRepository
            .Setup(repo => repo.GetByIdAsync(1))
            .ReturnsAsync(fakeBuyer);

        // Act
        var result = await _buyerService.GetBuyerByIdAsync(1);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result!.BuyerId, Is.EqualTo(1));
        Assert.That(result.FirstName, Is.EqualTo("Rajesh"));
        Assert.That(result.EmailId, Is.EqualTo("rajesh.sharma@example.com"));
    }

    [Test]
    public async Task GetBuyerByIdAsync_WhenBuyerDoesNotExist_ReturnsNull()
    {
        // Arrange
        _mockBuyerRepository
            .Setup(repo => repo.GetByIdAsync(99))
            .ReturnsAsync((Buyer?)null);

        // Act
        var result = await _buyerService.GetBuyerByIdAsync(99);

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task CreateBuyerAsync_WhenValidBuyerDto_ReturnsCreatedBuyer()
    {
        // Arrange
        var newBuyerDto = new CreateBuyerDto
        {
            FirstName = "Aarav",
            LastName = "Gupta",
            EmailId = "aarav.gupta@example.com",
            PhoneNo = "9812345678",
            DateOfBirth = DateTime.UtcNow.AddYears(-25) // 25 years old
        };

        _mockBuyerRepository
            .Setup(repo => repo.ExistsAsync("aarav.gupta@example.com"))
            .ReturnsAsync(false);

        _mockBuyerRepository
            .Setup(repo => repo.AddAsync(It.IsAny<Buyer>()))
            .ReturnsAsync((Buyer b) => { b.BuyerId = 10; return b; });

        // Act
        var result = await _buyerService.CreateBuyerAsync(newBuyerDto);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.BuyerId, Is.EqualTo(10));
        Assert.That(result.FirstName, Is.EqualTo("Aarav"));
        Assert.That(result.EmailId, Is.EqualTo("aarav.gupta@example.com"));
    }

    [Test]
    public void CreateBuyerAsync_WhenBuyerUnder18_ThrowsInvalidOperationException()
    {
        // Arrange: Buyer is under 18 years old
        var underageDto = new CreateBuyerDto
        {
            FirstName = "Rahul",
            LastName = "Verma",
            EmailId = "rahul@example.com",
            PhoneNo = "9812345678",
            DateOfBirth = DateTime.UtcNow.AddYears(-15) // 15 years old
        };

        // Act & Assert: Expect InvalidOperationException
        Assert.ThrowsAsync<InvalidOperationException>(async () =>
        {
            await _buyerService.CreateBuyerAsync(underageDto);
        });
    }
}
