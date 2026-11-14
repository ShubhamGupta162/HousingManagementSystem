namespace EasyHousingSolution.PropertyService.Domain.Entities;

public class State
{
    public int StateId { get; set; }
    public string StateName { get; set; } = string.Empty;
}

public class City
{
    public int CityId { get; set; }
    public string CityName { get; set; } = string.Empty;
    public int StateId { get; set; }
}

public class Property
{
    public int PropertyId { get; set; }
    public string PropertyName { get; set; } = string.Empty;
    public string PropertyType { get; set; } = string.Empty;
    public string PropertyOption { get; set; } = string.Empty; // Sell or Rent
    public string? Description { get; set; }
    public string Address { get; set; } = string.Empty;
    public decimal PriceRange { get; set; }
    public decimal InitialDeposit { get; set; }
    public string Landmark { get; set; } = string.Empty;
    public bool IsActive { get; set; } = false; // Verified by Admin
    public string? DeactivationReason { get; set; }
    public int SellerId { get; set; }
    public int CityId { get; set; }
}

public class PropertyImage
{
    public int ImageId { get; set; }
    public int PropertyId { get; set; }
    public string ImageData { get; set; } = string.Empty; // Maps to [Image] column in Images table
    public string Image { get => ImageData; set => ImageData = value; }
}
