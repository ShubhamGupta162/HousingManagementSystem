using EasyHousingSolution.CartService.Application.DTOs;
using EasyHousingSolution.CartService.Application.Interfaces;
using EasyHousingSolution.CartService.Application.Services;
using EasyHousingSolution.CartService.Domain.Entities;
using EasyHousingSolution.CartService.Domain.Interfaces;
using Moq;
using NUnit.Framework;

namespace EasyHousingSolution.Tests;

[TestFixture]
public class CartServiceTests
{
    private Mock<ICartRepository> _mockCartRepo = null!;
    private HttpClient _httpClient = null!;
    private CartAppService _cartService = null!;

    [SetUp]
    public void SetUp()
    {
        _mockCartRepo = new Mock<ICartRepository>();
        _httpClient = new HttpClient();

        _cartService = new CartAppService(
            _mockCartRepo.Object,
            _httpClient);
    }

    [TearDown]
    public void TearDown()
    {
        _httpClient.Dispose();
    }

    [Test]
    public async Task AddToCartAsync_WhenValidBuyer_AddsPropertyToCart()
    {
        // Arrange
        var dto = new AddToCartDto { BuyerId = 1, PropertyId = 10 };
        _mockCartRepo.Setup(r => r.ExistsAsync(1, 10)).ReturnsAsync(false);
        _mockCartRepo.Setup(r => r.AddAsync(It.IsAny<CartItem>()))
            .ReturnsAsync(new CartItem { CartId = 100, BuyerId = 1, PropertyId = 10 });

        // Act
        var result = await _cartService.AddToCartAsync(dto);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.CartId, Is.EqualTo(100));
        Assert.That(result.BuyerId, Is.EqualTo(1));
        Assert.That(result.PropertyId, Is.EqualTo(10));
        _mockCartRepo.Verify(r => r.AddAsync(It.IsAny<CartItem>()), Times.Once);
    }

    [Test]
    public void AddToCartAsync_WhenPropertyAlreadyInCart_ThrowsInvalidOperationException()
    {
        // Arrange
        var dto = new AddToCartDto { BuyerId = 1, PropertyId = 10 };
        _mockCartRepo.Setup(r => r.ExistsAsync(1, 10)).ReturnsAsync(true);

        // Act & Assert
        Assert.ThrowsAsync<InvalidOperationException>(async () =>
        {
            await _cartService.AddToCartAsync(dto);
        });
    }

    [Test]
    public async Task GetBuyerCartAsync_ReturnsAllCartItemsForBuyer()
    {
        // Arrange
        int buyerId = 1;
        var cartItems = new List<CartItem>
        {
            new CartItem { CartId = 1, BuyerId = buyerId, PropertyId = 10 },
            new CartItem { CartId = 2, BuyerId = buyerId, PropertyId = 20 }
        };
        _mockCartRepo.Setup(r => r.GetByBuyerIdAsync(buyerId)).ReturnsAsync(cartItems);

        // Act
        var result = (await _cartService.GetBuyerCartAsync(buyerId)).ToList();

        // Assert
        Assert.That(result, Has.Count.EqualTo(2));
        Assert.That(result[0].PropertyId, Is.EqualTo(10));
        Assert.That(result[1].PropertyId, Is.EqualTo(20));
    }

    [Test]
    public async Task RemoveFromCartAsync_WhenItemExists_ReturnsTrue()
    {
        // Arrange
        int cartId = 5;
        _mockCartRepo.Setup(r => r.RemoveAsync(cartId)).ReturnsAsync(true);

        // Act
        var result = await _cartService.RemoveFromCartAsync(cartId);

        // Assert
        Assert.That(result, Is.True);
        _mockCartRepo.Verify(r => r.RemoveAsync(cartId), Times.Once);
    }
}
