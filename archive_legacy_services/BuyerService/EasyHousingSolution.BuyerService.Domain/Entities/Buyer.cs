namespace EasyHousingSolution.BuyerService.Domain.Entities;

public class Buyer
{
    public int BuyerId { get; set; }
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string EmailId { get; set; } = string.Empty;
    public string PhoneNo { get; set; } = string.Empty;
}
