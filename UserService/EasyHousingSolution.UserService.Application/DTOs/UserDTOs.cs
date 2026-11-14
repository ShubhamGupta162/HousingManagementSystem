using System.ComponentModel.DataAnnotations;

namespace EasyHousingSolution.UserService.Application.DTOs;

public class CreateBuyerDto
{
    [Required]
    [StringLength(25, MinimumLength = 1)]
    public string FirstName { get; set; } = string.Empty;

    [StringLength(25)]
    public string? LastName { get; set; }

    [Required(ErrorMessage = "Date of birth is required.")]
    public DateTime DateOfBirth { get; set; }

    [Required(ErrorMessage = "Mobile number is required.")]
    [RegularExpression(@"^[6-9][0-9]{9}$", ErrorMessage = "Mobile number must be exactly 10 digits starting with 6, 7, 8, or 9.")]
    public string PhoneNo { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(50)]
    public string EmailId { get; set; } = string.Empty;

    [StringLength(25)]
    public string? UserName { get; set; }
}

public class BuyerResponseDto
{
    public int BuyerId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string? LastName { get; set; }
    public string FullName => string.IsNullOrWhiteSpace(LastName) ? FirstName : $"{FirstName} {LastName}".Trim();
    public DateTime DateOfBirth { get; set; }
    public string PhoneNo { get; set; } = string.Empty;
    public string EmailId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
}

public class CreateSellerDto
{
    [Required]
    [StringLength(25)]
    public string UserName { get; set; } = string.Empty;

    [Required]
    [StringLength(25, MinimumLength = 1)]
    public string FirstName { get; set; } = string.Empty;

    [StringLength(25)]
    public string? LastName { get; set; }

    [Required]
    public DateTime DateofBirth { get; set; }

    [Required(ErrorMessage = "Phone number is required.")]
    [RegularExpression(@"^[6-9][0-9]{9}$", ErrorMessage = "Phone number must be exactly 10 digits starting with 6, 7, 8, or 9.")]
    public string PhoneNo { get; set; } = string.Empty;

    [Required]
    [StringLength(250)]
    public string Address { get; set; } = string.Empty;

    [Required]
    public int StateId { get; set; }

    [Required]
    public int CityId { get; set; }

    [Required]
    [EmailAddress]
    [StringLength(50)]
    public string EmailId { get; set; } = string.Empty;
}

public class SellerResponseDto
{
    public int SellerId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string? LastName { get; set; }
    public string FullName => string.IsNullOrWhiteSpace(LastName) ? FirstName : $"{FirstName} {LastName}".Trim();
    public DateTime DateofBirth { get; set; }
    public string PhoneNo { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public int StateId { get; set; }
    public int CityId { get; set; }
    public string EmailId { get; set; } = string.Empty;
}

public class SellerContactDto
{
    public int SellerId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string? LastName { get; set; }
    public string PhoneNo { get; set; } = string.Empty;
    public string EmailId { get; set; } = string.Empty;
}

public class UserSummaryDto
{
    public int ProfileId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string EmailId { get; set; } = string.Empty;
    public string PhoneNo { get; set; } = string.Empty;
    public string UserType { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class UpdateUserProfileDto
{
    public string FirstName { get; set; } = string.Empty;
    public string? LastName { get; set; }
    public string PhoneNo { get; set; } = string.Empty;
    public DateTime? DateOfBirth { get; set; }
    public string? Address { get; set; }
    public int? StateId { get; set; }
    public int? CityId { get; set; }
}

public class UpdateBuyerProfileDto
{
    [Required]
    [StringLength(25, MinimumLength = 1)]
    public string FirstName { get; set; } = string.Empty;

    [StringLength(25)]
    public string? LastName { get; set; }

    [Required(ErrorMessage = "Mobile number is required.")]
    [RegularExpression(@"^[6-9][0-9]{9}$", ErrorMessage = "Mobile number must be exactly 10 digits starting with 6, 7, 8, or 9.")]
    public string PhoneNo { get; set; } = string.Empty;

    public DateTime? DateOfBirth { get; set; }
}

public class UpdateSellerProfileDto
{
    [Required]
    [StringLength(25, MinimumLength = 1)]
    public string FirstName { get; set; } = string.Empty;

    [StringLength(25)]
    public string? LastName { get; set; }

    [Required(ErrorMessage = "Phone number is required.")]
    [RegularExpression(@"^[6-9][0-9]{9}$", ErrorMessage = "Phone number must be exactly 10 digits starting with 6, 7, 8, or 9.")]
    public string PhoneNo { get; set; } = string.Empty;

    [Required]
    [StringLength(250)]
    public string Address { get; set; } = string.Empty;

    [Required]
    public int StateId { get; set; }

    [Required]
    public int CityId { get; set; }
}

public class UserStatusUpdateDto
{
    public bool IsActive { get; set; }
    public string? Reason { get; set; }
}
