using System.Net.Http.Json;
using EasyHousingSolution.CartService.Application.DTOs;
using EasyHousingSolution.CartService.Application.Interfaces;
using EasyHousingSolution.CartService.Domain.Entities;
using EasyHousingSolution.CartService.Domain.Interfaces;

namespace EasyHousingSolution.CartService.Application.Services;

public class CartAppService : ICartAppService
{
    private readonly ICartRepository _cartRepository;
    private readonly HttpClient _httpClient;

    public CartAppService(ICartRepository cartRepository, HttpClient httpClient)
    {
        _cartRepository = cartRepository;
        _httpClient = httpClient;
    }

    public async Task<CartItemDto> AddToCartAsync(AddToCartDto dto)
    {
        if (await _cartRepository.ExistsAsync(dto.BuyerId, dto.PropertyId))
        {
            throw new InvalidOperationException("Property is already in buyer's cart.");
        }

        var item = new CartItem
        {
            BuyerId = dto.BuyerId,
            PropertyId = dto.PropertyId
        };

        var created = await _cartRepository.AddAsync(item);
        return new CartItemDto
        {
            CartId = created.CartId,
            BuyerId = created.BuyerId,
            PropertyId = created.PropertyId
        };
    }

    public async Task<bool> RemoveFromCartAsync(int cartId)
    {
        return await _cartRepository.RemoveAsync(cartId);
    }

    public async Task<bool> RemovePropertyFromCartAsync(int buyerId, int propertyId)
    {
        var items = await _cartRepository.GetByBuyerIdAsync(buyerId);
        var item = items.FirstOrDefault(i => i.PropertyId == propertyId);
        if (item == null)
        {
            return false;
        }
        return await _cartRepository.RemoveAsync(item.CartId);
    }

    public async Task<IEnumerable<EnrichedCartItemDto>> GetBuyerCartAsync(int buyerId)
    {
        var items = await _cartRepository.GetByBuyerIdAsync(buyerId);
        var enriched = new List<EnrichedCartItemDto>();

        foreach (var item in items)
        {
            PropertySummaryDto? property = null;
            try
            {
                property = await _httpClient.GetFromJsonAsync<PropertySummaryDto>($"api/properties/{item.PropertyId}");
            }
            catch
            {
                // If PropertyService is unreachable or not found, leave property null
            }

            enriched.Add(new EnrichedCartItemDto
            {
                CartId = item.CartId,
                BuyerId = item.BuyerId,
                PropertyId = item.PropertyId,
                Property = property
            });
        }

        return enriched;
    }

    public async Task<bool> ClearBuyerCartAsync(int buyerId)
    {
        return await _cartRepository.ClearBuyerCartAsync(buyerId);
    }
}
