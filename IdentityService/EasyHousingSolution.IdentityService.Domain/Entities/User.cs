namespace EasyHousingSolution.IdentityService.Domain.Entities;

public class User
{
    public string UserName { get; set; } = string.Empty; // varchar(25) primary key
    public string Password { get; set; } = string.Empty; // varchar(25) not null
    public string UserType { get; set; } = string.Empty; // varchar(15) not null: Admin, Buyer, Seller

    // Runtime helper properties (ignored in EF table schema)
    public string? FullName { get; set; }
    public string? PhoneNo { get; set; }
    public int? ProfileId { get; set; }
}
