namespace EasyHousingSolution.IdentityService.Domain.Entities;

public class User
{
    public string UserName { get; set; } = string.Empty; // Same as EmailId
    public string Password { get; set; } = string.Empty; // Salted hash
    public string UserType { get; set; } = string.Empty; // Admin, Buyer, Seller
}
