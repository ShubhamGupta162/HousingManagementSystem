using System.ComponentModel.DataAnnotations;

namespace EasyHousingSolution.PropertyService.Application.DTOs;

public class CreatePropertyDto
{
    [Required]
    [StringLength(50)]
    public string PropertyName { get; set; } = string.Empty;

    [Required]
    [StringLength(15)]
    public string PropertyType { get; set; } = string.Empty;

    [Required]
    [StringLength(10)]
    public string PropertyOption { get; set; } = string.Empty; // Sell or Rent

    [StringLength(250)]
    public string? Description { get; set; }

    [Required]
    [StringLength(250)]
    public string Address { get; set; } = string.Empty;

    [Required]
    [Range(1, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal PriceRange { get; set; }

    public decimal InitialDeposit { get; set; }

    [Required]
    [StringLength(25)]
    public string Landmark { get; set; } = string.Empty;

    [Required]
    public int SellerId { get; set; }

    [Required]
    public int CityId { get; set; }
}

public class UpdatePropertyDto
{
    [Required]
    [StringLength(50)]
    public string PropertyName { get; set; } = string.Empty;

    [Required]
    [StringLength(15)]
    public string PropertyType { get; set; } = string.Empty;

    [Required]
    [StringLength(10)]
    public string PropertyOption { get; set; } = string.Empty;

    [StringLength(250)]
    public string? Description { get; set; }

    [Required]
    [StringLength(250)]
    public string Address { get; set; } = string.Empty;

    [Required]
    [Range(1, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal PriceRange { get; set; }

    public decimal InitialDeposit { get; set; }

    [Required]
    [StringLength(25)]
    public string Landmark { get; set; } = string.Empty;

    [Required]
    public int CityId { get; set; }
}

public class DeactivatePropertyDto
{
    [Required]
    [StringLength(250)]
    public string Reason { get; set; } = string.Empty;
}

public class PropertyStatusUpdateDto
{
    public bool IsActive { get; set; }
    public string? Reason { get; set; }
}

public class PropertyResponseDto
{
    public int PropertyId { get; set; }
    public string PropertyName { get; set; } = string.Empty;
    public string PropertyType { get; set; } = string.Empty;
    public string PropertyOption { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Address { get; set; } = string.Empty;
    public decimal PriceRange { get; set; }
    public decimal InitialDeposit { get; set; }
    public string Landmark { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public string? DeactivationReason { get; set; }
    public int SellerId { get; set; }
    public int CityId { get; set; }
}

public class StateDto
{
    public int StateId { get; set; }

    [Required]
    [StringLength(30)]
    public string StateName { get; set; } = string.Empty;
}

public class CityDto
{
    public int CityId { get; set; }

    [Required]
    [StringLength(50)]
    public string CityName { get; set; } = string.Empty;

    [Required]
    public int StateId { get; set; }
}

public class PropertyImageDto
{
    public int ImageId { get; set; }
    public int PropertyId { get; set; }
    public string ImageData { get; set; } = string.Empty;
}

public class UploadImagesDto
{
    [Required]
    public List<string> Images { get; set; } = new();
}

public class BuyPropertyDto
{
    public int? BuyerId { get; set; }
}

public class AdminSalesReportDto
{
    public int TotalProperties { get; set; }
    public int TotalActiveProperties { get; set; }
    public int TotalSoldProperties { get; set; }
    public int TotalDeactivatedProperties { get; set; }
    public decimal TotalSoldValue { get; set; }
    public decimal TotalActiveValue { get; set; }
    public List<PropertyResponseDto> SoldProperties { get; set; } = new();
}
