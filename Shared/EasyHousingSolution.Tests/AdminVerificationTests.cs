using NUnit.Framework;
using Moq;
using Microsoft.Extensions.Logging;
using EasyHousingSolution.PropertyService.Application.Services;
using EasyHousingSolution.PropertyService.Domain.Entities;
using EasyHousingSolution.PropertyService.Domain.Interfaces;

namespace EasyHousingSolution.Tests.Services;

[TestFixture]
public class AdminVerificationTests
{
    private Mock<IPropertyRepository> _mockPropertyRepository = null!;
    private Mock<ILogger<PropertyAppService>> _mockLogger = null!;
    private PropertyAppService _propertyService = null!;

    [SetUp]
    public void Setup()
    {
        // 1. Arrange: Create mock repository & logger
        _mockPropertyRepository = new Mock<IPropertyRepository>();
        _mockLogger = new Mock<ILogger<PropertyAppService>>();

        // 2. Initialize PropertyAppService with mock repository and logger
        _propertyService = new PropertyAppService(_mockPropertyRepository.Object, _mockLogger.Object);
    }

    [Test]
    public async Task VerifyPropertyAsync_WhenPropertyExists_SetsIsActiveToTrue()
    {
        // Arrange: Pending/unverified property
        var pendingProperty = new Property
        {
            PropertyId = 101,
            PropertyName = "Green Acres Villa",
            PropertyType = "Villa",
            PropertyOption = "Sell",
            Address = "12 MG Road",
            PriceRange = 7500000,
            IsActive = false,
            DeactivationReason = "Awaiting verification",
            SellerId = 1,
            CityId = 1
        };

        _mockPropertyRepository
            .Setup(repo => repo.GetByIdAsync(101))
            .ReturnsAsync(pendingProperty);

        _mockPropertyRepository
            .Setup(repo => repo.UpdateAsync(It.IsAny<Property>()))
            .Returns(Task.CompletedTask);

        // Act: Admin verifies the property
        var result = await _propertyService.VerifyPropertyAsync(101);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.IsActive, Is.True);
        Assert.That(result.DeactivationReason, Is.Null);
        _mockPropertyRepository.Verify(repo => repo.UpdateAsync(It.Is<Property>(p => p.IsActive == true)), Times.Once);
    }

    [Test]
    public void VerifyPropertyAsync_WhenPropertyNotFound_ThrowsKeyNotFoundException()
    {
        // Arrange: Property does not exist
        _mockPropertyRepository
            .Setup(repo => repo.GetByIdAsync(999))
            .ReturnsAsync((Property?)null);

        // Act & Assert
        Assert.ThrowsAsync<KeyNotFoundException>(async () =>
        {
            await _propertyService.VerifyPropertyAsync(999);
        });
    }

    [Test]
    public async Task DeactivatePropertyAsync_WhenReasonProvided_SetsIsActiveToFalseAndSavesReason()
    {
        // Arrange: Active property
        var activeProperty = new Property
        {
            PropertyId = 102,
            PropertyName = "Sunrise Apartment",
            PropertyType = "Apartment",
            PropertyOption = "Rent",
            Address = "45 Lake View Road",
            PriceRange = 25000,
            IsActive = true,
            SellerId = 2,
            CityId = 2
        };

        _mockPropertyRepository
            .Setup(repo => repo.GetByIdAsync(102))
            .ReturnsAsync(activeProperty);

        _mockPropertyRepository
            .Setup(repo => repo.UpdateAsync(It.IsAny<Property>()))
            .Returns(Task.CompletedTask);

        // Act: Admin deactivates the property with a reason
        var result = await _propertyService.DeactivatePropertyAsync(102, "Property document verification failed");

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.IsActive, Is.False);
        Assert.That(result.DeactivationReason, Is.EqualTo("Property document verification failed"));
        _mockPropertyRepository.Verify(repo => repo.UpdateAsync(It.Is<Property>(p => p.IsActive == false && p.DeactivationReason == "Property document verification failed")), Times.Once);
    }

    [Test]
    public void DeactivatePropertyAsync_WhenReasonIsEmpty_ThrowsArgumentException()
    {
        // Act & Assert: Admin must provide a non-empty reason
        Assert.ThrowsAsync<ArgumentException>(async () =>
        {
            await _propertyService.DeactivatePropertyAsync(102, "");
        });
    }
}
