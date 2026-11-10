namespace EasyHousingSolution.IdentityService.Domain.Entities;

public class Buyer
{
    public int BuyerId { get; set; }
    public string EmailId { get; set; } = string.Empty; // Same as UserName
    public string FullName { get; set; } = string.Empty;
    public string PhoneNo { get; set; } = string.Empty;
}
