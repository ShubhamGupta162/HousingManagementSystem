using System.ComponentModel.DataAnnotations;

namespace EasyHousingSolution.IdentityService.Application.DTOs;

public class RegisterBuyerDto
{
    [Required]
    [EmailAddress]
    public string EmailId { get; set; } = string.Empty;

    [Required]
    [StringLength(50, MinimumLength = 6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [Phone]
    [StringLength(10)]
    public string PhoneNo { get; set; } = string.Empty;
}

public class RegisterSellerDto
{
    [Required]
    [EmailAddress]
    public string EmailId { get; set; } = string.Empty;

    [Required]
    [StringLength(50, MinimumLength = 6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [Phone]
    [StringLength(10)]
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
}

public class BuyerDto
{
    public int BuyerId { get; set; }

    [Required]
    [EmailAddress]
    public string EmailId { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [Phone]
    [StringLength(10)]
    public string PhoneNo { get; set; } = string.Empty;
}

public class SellerDto
{
    public int SellerId { get; set; }

    [Required]
    [EmailAddress]
    public string EmailId { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [Phone]
    [StringLength(10)]
    public string PhoneNo { get; set; } = string.Empty;

    [Required]
    [StringLength(250)]
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
