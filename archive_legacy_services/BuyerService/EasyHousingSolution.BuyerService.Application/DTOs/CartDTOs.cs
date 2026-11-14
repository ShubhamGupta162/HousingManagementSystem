using System.ComponentModel.DataAnnotations;

namespace EasyHousingSolution.BuyerService.Application.DTOs;

public class AddToCartDto
{
    [Required]
    public int BuyerId { get; set; }

    [Required]
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
    public string Address { get; set; } = string.Empty;
    public decimal PriceRange { get; set; }
    public decimal InitialDeposit { get; set; }
    public string Landmark { get; set; } = string.Empty;
    public int SellerId { get; set; }
    public bool IsActive { get; set; }
}

public class EnrichedCartItemDto
{
    public int CartId { get; set; }
    public int BuyerId { get; set; }
    public int PropertyId { get; set; }
    public PropertySummaryDto? Property { get; set; }
}
