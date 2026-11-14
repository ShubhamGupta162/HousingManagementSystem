using System.ComponentModel.DataAnnotations;

namespace EasyHousingSolution.SellerService.Application.DTOs;

public class CreateSellerDto
{
    [Required]
    public int UserId { get; set; }

    [Required]
    [StringLength(50)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(50)]
    public string EmailId { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^[0-9]{10}$", ErrorMessage = "Phone number must be exactly 10 digits")]
    public string PhoneNo { get; set; } = string.Empty;

    [Required]
    [StringLength(250)]
    public string Address { get; set; } = string.Empty;

    [Required]
    public int StateId { get; set; }

    [Required]
    public int CityId { get; set; }
}

public class SellerResponseDto
{
    public int SellerId { get; set; }
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string EmailId { get; set; } = string.Empty;
    public string PhoneNo { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public int StateId { get; set; }
    public int CityId { get; set; }
}

public class SellerContactDto
{
    public int SellerId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string EmailId { get; set; } = string.Empty;
    public string PhoneNo { get; set; } = string.Empty;
}
