using EasyHousingSolution.CartService.Application.DTOs;
using EasyHousingSolution.CartService.Application.Interfaces;
using EasyHousingSolution.CartService.Domain.Entities;
using EasyHousingSolution.CartService.Domain.Interfaces;

namespace EasyHousingSolution.CartService.Application.Services;

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
        if (dto.BuyerId <= 0 || dto.PropertyId <= 0)
        {
            throw new ArgumentException("Valid BuyerId and PropertyId are required.");
        }

        // Validate via HttpClient that the property actually exists in PropertyService
        var property = await _propertyServiceClient.GetPropertyByIdAsync(dto.PropertyId);
        if (property == null)
        {
            throw new KeyNotFoundException($"Property with ID {dto.PropertyId} does not exist in PropertyService.");
        }

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

        var entity = new CartItem
        {
            BuyerId = dto.BuyerId,
            PropertyId = dto.PropertyId
        };

        var added = await _cartRepository.AddAsync(entity);
        return new CartItemDto
        {
            CartId = added.CartId,
            BuyerId = added.BuyerId,
            PropertyId = added.PropertyId
        };
    }

    public async Task<IEnumerable<EnrichedCartItemDto>> GetCartByBuyerIdAsync(int buyerId)
    {
        var items = await _cartRepository.GetByBuyerIdAsync(buyerId);
        var enrichedList = new List<EnrichedCartItemDto>();

        foreach (var item in items)
        {
            // Call PropertyService via HttpClient to enrich the cart response with full property details
            var property = await _propertyServiceClient.GetPropertyByIdAsync(item.PropertyId);

            enrichedList.Add(new EnrichedCartItemDto
            {
                CartId = item.CartId,
                BuyerId = item.BuyerId,
                PropertyId = item.PropertyId,
                Property = property
            });
        }

        return enrichedList;
    }

    public async Task DeleteFromCartAsync(int cartId)
    {
        await _cartRepository.DeleteByIdAsync(cartId);
    }

    public async Task DeleteFromCartByBuyerAndPropertyAsync(int buyerId, int propertyId)
    {
        await _cartRepository.DeleteByBuyerAndPropertyAsync(buyerId, propertyId);
    }
}
