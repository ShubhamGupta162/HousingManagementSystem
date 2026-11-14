using System.ComponentModel.DataAnnotations;

namespace EasyHousingSolution.BuyerService.Application.DTOs;

public class CreateBuyerDto
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
}

public class BuyerResponseDto
{
    public int BuyerId { get; set; }
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string EmailId { get; set; } = string.Empty;
    public string PhoneNo { get; set; } = string.Empty;
}
