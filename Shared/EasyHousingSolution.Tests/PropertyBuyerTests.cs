using EasyHousingSolution.PropertyService.Application.DTOs;
using EasyHousingSolution.PropertyService.Application.Interfaces;
using EasyHousingSolution.PropertyService.Application.Services;
using EasyHousingSolution.PropertyService.Domain.Entities;
using EasyHousingSolution.PropertyService.Domain.Interfaces;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;

namespace EasyHousingSolution.Tests.Services;

[TestFixture]
public class PropertyBuyerTests
{
    private Mock<IPropertyRepository> _mockPropertyRepo = null!;
    private PropertyAppService _propertyAppService = null!;

    [SetUp]
    public void Setup()
    {
        _mockPropertyRepo = new Mock<IPropertyRepository>();
        var mockLogger = new Mock<ILogger<PropertyAppService>>();
        _propertyAppService = new PropertyAppService(_mockPropertyRepo.Object, mockLogger.Object);
    }

    [Test]
    public async Task GetAllPropertiesForBuyer_ReturnsVerifiedListings()
    {
        // Arrange
        var fakeProperties = new List<Property>
        {
            new Property
            {
                PropertyId = 1,
                PropertyName = "Green Meadows Luxury Villa",
                PropertyType = "Villa",
                PropertyOption = "Sell",
                PriceRange = 12000000m,
                InitialDeposit = 500000m,
                Landmark = "Near Central Mall",
                Address = "Plot 42, Hitech City",
                IsActive = true,
                SellerId = 1,
                CityId = 3
            },
            new Property
            {
                PropertyId = 2,
                PropertyName = "Sunrise Bay 2BHK Apartment",
                PropertyType = "Apartment",
                PropertyOption = "Rent",
                PriceRange = 25000m,
                InitialDeposit = 50000m,
                Landmark = "Sea Link",
                Address = "Bandra West",
                IsActive = true,
                SellerId = 2,
                CityId = 1
            }
        };

        _mockPropertyRepo.Setup(r => r.GetVerifiedPropertiesAsync())
            .ReturnsAsync(fakeProperties);

        // Act
        var result = (await _propertyAppService.GetVerifiedPropertiesAsync()).ToList();

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Count, Is.EqualTo(2));
        Assert.That(result[0].PropertyName, Is.EqualTo("Green Meadows Luxury Villa"));
        Assert.That(result[0].IsActive, Is.True);
        Assert.That(result[1].PropertyName, Is.EqualTo("Sunrise Bay 2BHK Apartment"));
        Assert.That(result[1].IsActive, Is.True);
    }

    [Test]
    public async Task GetPropertyById_WhenActivePropertyExists_ReturnsPropertyDto()
    {
        // Arrange
        var prop = new Property
        {
            PropertyId = 5,
            PropertyName = "Lakeview Penthouse",
            PropertyType = "Penthouse",
            PropertyOption = "Sell",
            PriceRange = 25000000m,
            InitialDeposit = 1000000m,
            Landmark = "Lake Road",
            Address = "Tower 1, Top Floor",
            IsActive = true,
            SellerId = 3,
            CityId = 2
        };

        _mockPropertyRepo.Setup(r => r.GetByIdAsync(5)).ReturnsAsync(prop);

        // Act
        var result = await _propertyAppService.GetPropertyByIdAsync(5);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result!.PropertyId, Is.EqualTo(5));
        Assert.That(result.PropertyName, Is.EqualTo("Lakeview Penthouse"));
        Assert.That(result.PriceRange, Is.EqualTo(25000000m));
    }

    [Test]
    public async Task BuyPropertyAsync_WhenActive_MarksInactiveAndSetsReason()
    {
        // Arrange
        var prop = new Property
        {
            PropertyId = 10,
            PropertyName = "Orchid Greens Flat",
            PriceRange = 5000000m,
            IsActive = true,
            SellerId = 2
        };

        _mockPropertyRepo.Setup(r => r.GetByIdAsync(10)).ReturnsAsync(prop);
        _mockPropertyRepo.Setup(r => r.UpdateAsync(It.IsAny<Property>())).Returns(Task.CompletedTask);

        // Act
        var result = await _propertyAppService.BuyPropertyAsync(10, 5);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.IsActive, Is.False);
        Assert.That(result.DeactivationReason, Is.EqualTo("Sold to Buyer #5"));
        _mockPropertyRepo.Verify(r => r.UpdateAsync(It.Is<Property>(p =>
            p.PropertyId == 10 &&
            !p.IsActive &&
            p.DeactivationReason == "Sold to Buyer #5"
        )), Times.Once);
    }

    [Test]
    public void BuyPropertyAsync_WhenAlreadySold_ThrowsInvalidOperationException()
    {
        // Arrange
        var soldProp = new Property
        {
            PropertyId = 11,
            PropertyName = "Sold Flat",
            IsActive = false,
            DeactivationReason = "Sold to Buyer #3"
        };

        _mockPropertyRepo.Setup(r => r.GetByIdAsync(11)).ReturnsAsync(soldProp);

        // Act & Assert
        Assert.ThrowsAsync<InvalidOperationException>(async () =>
        {
            await _propertyAppService.BuyPropertyAsync(11, 2);
        });
    }

    [Test]
    public async Task GetPurchasedPropertiesByBuyerId_ReturnsBuyersProperties()
    {
        // Arrange
        var boughtProps = new List<Property>
        {
            new Property
            {
                PropertyId = 20,
                PropertyName = "Boutique Apartment",
                IsActive = false,
                DeactivationReason = "Sold to Buyer #7"
            }
        };

        _mockPropertyRepo.Setup(r => r.GetPurchasedPropertiesByBuyerIdAsync(7)).ReturnsAsync(boughtProps);

        // Act
        var result = (await _propertyAppService.GetPurchasedPropertiesByBuyerIdAsync(7)).ToList();

        // Assert
        Assert.That(result.Count, Is.EqualTo(1));
        Assert.That(result[0].PropertyId, Is.EqualTo(20));
        Assert.That(result[0].DeactivationReason, Is.EqualTo("Sold to Buyer #7"));
    }

    [Test]
    public async Task GetSoldPropertiesBySellerId_ReturnsSellersSoldProperties()
    {
        // Arrange
        var soldProps = new List<Property>
        {
            new Property
            {
                PropertyId = 30,
                PropertyName = "Luxury Penthouse",
                SellerId = 4,
                IsActive = false,
                DeactivationReason = "Sold to Buyer #1"
            }
        };

        _mockPropertyRepo.Setup(r => r.GetSoldPropertiesBySellerIdAsync(4)).ReturnsAsync(soldProps);

        // Act
        var result = (await _propertyAppService.GetSoldPropertiesBySellerIdAsync(4)).ToList();

        // Assert
        Assert.That(result.Count, Is.EqualTo(1));
        Assert.That(result[0].PropertyId, Is.EqualTo(30));
    }

    [Test]
    public async Task GetSalesReportAsync_AggregatesCorrectTotals()
    {
        // Arrange
        var allProps = new List<Property>
        {
            new Property { PropertyId = 1, PriceRange = 1000000m, IsActive = true },
            new Property { PropertyId = 2, PriceRange = 2000000m, IsActive = false, DeactivationReason = "Sold to Buyer #1" },
            new Property { PropertyId = 3, PriceRange = 3000000m, IsActive = false, DeactivationReason = "Incomplete documents" }
        };

        _mockPropertyRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(allProps);

        // Act
        var report = await _propertyAppService.GetSalesReportAsync();

        // Assert
        Assert.That(report.TotalProperties, Is.EqualTo(3));
        Assert.That(report.TotalActiveProperties, Is.EqualTo(1));
        Assert.That(report.TotalSoldProperties, Is.EqualTo(1));
        Assert.That(report.TotalDeactivatedProperties, Is.EqualTo(1));
        Assert.That(report.TotalSoldValue, Is.EqualTo(2000000m));
        Assert.That(report.TotalActiveValue, Is.EqualTo(1000000m));
    }
}
