namespace EasyHousingSolution.BuyerService.Domain.Entities;

public class CartItem
{
    public int CartId { get; set; }
    public int BuyerId { get; set; }
    public int PropertyId { get; set; }
}
