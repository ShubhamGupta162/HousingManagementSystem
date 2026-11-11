using System.ComponentModel.DataAnnotations;

namespace EasyHousingSolution.IdentityService.Application.DTOs;

public class RegisterBuyerDto
{
    [Required]
    [EmailAddress]
    [StringLength(50)]
    public string EmailId { get; set; } = string.Empty;

    [Required]
    [StringLength(50, MinimumLength = 6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^[0-9]{10}$", ErrorMessage = "Phone number must be exactly 10 digits")]
    public string PhoneNo { get; set; } = string.Empty;
}

public class RegisterSellerDto
{
    [Required]
    [EmailAddress]
    [StringLength(50)]
    public string EmailId { get; set; } = string.Empty;

    [Required]
    [StringLength(50, MinimumLength = 6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string FullName { get; set; } = string.Empty;

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

public class LoginDto
{
    [Required]
    [EmailAddress]
    public string EmailId { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string EmailId { get; set; } = string.Empty;
    public string UserType { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public int? ProfileId { get; set; }
}

public class UserDto
{
    public string UserName { get; set; } = string.Empty;
    public string UserType { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string PhoneNo { get; set; } = string.Empty;
}
