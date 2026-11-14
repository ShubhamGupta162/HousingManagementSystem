namespace EasyHousingSolution.UserService.Domain.Entities;

public class Seller
{
    public int SellerId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string? LastName { get; set; }
    public DateTime DateofBirth { get; set; }
    public string PhoneNo { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public int StateId { get; set; }
    public int CityId { get; set; }
    public string EmailId { get; set; } = string.Empty;
}
