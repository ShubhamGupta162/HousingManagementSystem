namespace EasyHousingSolution.IdentityService.Domain.Entities;

public class Seller
{
    public int SellerId { get; set; }
    public string EmailId { get; set; } = string.Empty; // Same as UserName
    public string FullName { get; set; } = string.Empty;
    public string PhoneNo { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public int StateId { get; set; }
    public int CityId { get; set; }
}
