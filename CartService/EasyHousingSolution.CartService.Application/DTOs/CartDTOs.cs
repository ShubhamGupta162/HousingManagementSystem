using System.ComponentModel.DataAnnotations;

namespace EasyHousingSolution.CartService.Application.DTOs;

public class AddToCartDto
{
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Valid BuyerId is required.")]
    public int BuyerId { get; set; }

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Valid PropertyId is required.")]
    public int PropertyId { get; set; }
}

public class CartItemDto
{
    public int CartId { get; set; }
    public int BuyerId { get; set; }
    public int PropertyId { get; set; }
}

public class PropertySummaryDto
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
    public int SellerId { get; set; }
    public int CityId { get; set; }
}

public class EnrichedCartItemDto
{
    public int CartId { get; set; }
    public int BuyerId { get; set; }
    public int PropertyId { get; set; }
    public PropertySummaryDto? Property { get; set; }
}
