namespace EasyHousingSolution.SellerService.Domain.Entities;

public class Seller
{
    public int SellerId { get; set; }
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string EmailId { get; set; } = string.Empty;
    public string PhoneNo { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public int StateId { get; set; }
    public int CityId { get; set; }
}
