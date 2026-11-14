namespace EasyHousingSolution.UserService.Domain.Entities;

public class Buyer
{
    public int BuyerId { get; set; } // int identity primary key
    public string FirstName { get; set; } = string.Empty; // varchar(25) not null
    public string? LastName { get; set; } // varchar(25)
    public DateTime DateOfBirth { get; set; } // date not null
    public string PhoneNo { get; set; } = string.Empty; // varchar(10) not null
    public string EmailId { get; set; } = string.Empty; // varchar(50) not null

    // Runtime alias for email (ignored in EF table schema)
    public string UserName
    {
        get => EmailId;
        set { if (!string.IsNullOrWhiteSpace(value) && string.IsNullOrWhiteSpace(EmailId)) EmailId = value; }
    }
}
