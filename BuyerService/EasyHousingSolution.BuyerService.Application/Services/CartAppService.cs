using EasyHousingSolution.BuyerService.Application.DTOs;
using EasyHousingSolution.BuyerService.Application.Interfaces;
using EasyHousingSolution.BuyerService.Domain.Entities;
using EasyHousingSolution.BuyerService.Domain.Interfaces;

namespace EasyHousingSolution.BuyerService.Application.Services;

public class CartAppService : ICartAppService
{
    private readonly ICartRepository _cartRepository;
    private readonly IPropertyServiceClient _propertyServiceClient;

    public CartAppService(ICartRepository cartRepository, IPropertyServiceClient propertyServiceClient)
    {
        _cartRepository = cartRepository;
        _propertyServiceClient = propertyServiceClient;
    }

    public async Task<CartItemDto> AddToCartAsync(AddToCartDto dto)
    {
        var existing = await _cartRepository.GetItemAsync(dto.BuyerId, dto.PropertyId);
        if (existing != null)
        {
            return new CartItemDto
            {
                CartId = existing.CartId,
                BuyerId = existing.BuyerId,
                PropertyId = existing.PropertyId
            };
        }

        var cartItem = new CartItem
        {
            BuyerId = dto.BuyerId,
            PropertyId = dto.PropertyId
        };

        var created = await _cartRepository.AddAsync(cartItem);
        return new CartItemDto
        {
            CartId = created.CartId,
            BuyerId = created.BuyerId,
            PropertyId = created.PropertyId
        };
    }

    public async Task<bool> RemoveFromCartAsync(int cartId)
    {
        var item = await _cartRepository.GetByIdAsync(cartId);
        if (item == null) return false;

        await _cartRepository.DeleteAsync(item);
        return true;
    }

    public async Task<IEnumerable<EnrichedCartItemDto>> GetBuyerCartAsync(int buyerId)
    {
        var items = await _cartRepository.GetByBuyerIdAsync(buyerId);
        var enriched = new List<EnrichedCartItemDto>();

        foreach (var item in items)
        {
            var propSummary = await _propertyServiceClient.GetPropertySummaryAsync(item.PropertyId);
            enriched.Add(new EnrichedCartItemDto
            {
                CartId = item.CartId,
                BuyerId = item.BuyerId,
                PropertyId = item.PropertyId,
                Property = propSummary
            });
        }

        return enriched;
    }
}
