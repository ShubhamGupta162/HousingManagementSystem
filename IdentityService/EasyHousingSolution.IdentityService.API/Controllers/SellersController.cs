using EasyHousingSolution.IdentityService.Application.DTOs;
using EasyHousingSolution.IdentityService.Application.Interfaces;
using EasyHousingSolution.Shared.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EasyHousingSolution.IdentityService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SellersController : ControllerBase
{
    private readonly ISellerService _sellerService;

    public SellersController(ISellerService sellerService)
    {
        _sellerService = sellerService;
    }

    // Only Admin can see/view all sellers
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<IEnumerable<SellerDto>>>> GetAllSellers()
    {
        var sellers = await _sellerService.GetAllSellersAsync();
        return Ok(ApiResponse<IEnumerable<SellerDto>>.Ok(sellers));
    }

    [HttpGet("{id:int}")]
    [Authorize(Roles = "Seller,Admin")]
    public async Task<ActionResult<ApiResponse<SellerDto>>> GetSellerById(int id)
    {
        var seller = await _sellerService.GetSellerByIdAsync(id);
        if (seller == null)
        {
            return NotFound(ApiResponse<SellerDto>.Fail($"Seller with ID {id} not found."));
        }
        return Ok(ApiResponse<SellerDto>.Ok(seller));
    }

    [HttpGet("by-email/{email}")]
    [Authorize(Roles = "Seller,Admin")]
    public async Task<ActionResult<ApiResponse<SellerDto>>> GetSellerByEmail(string email)
    {
        var seller = await _sellerService.GetSellerByEmailAsync(email);
        if (seller == null)
        {
            return NotFound(ApiResponse<SellerDto>.Fail($"Seller with email '{email}' not found."));
        }
        return Ok(ApiResponse<SellerDto>.Ok(seller));
    }

    // Public / Buyer can see seller contact details for a listing
    [HttpGet("{id:int}/contact")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<SellerContactDto>>> GetSellerContact(int id)
    {
        var contact = await _sellerService.GetSellerContactAsync(id);
        if (contact == null)
        {
            return NotFound(ApiResponse<SellerContactDto>.Fail($"Seller with ID {id} not found."));
        }
        return Ok(ApiResponse<SellerContactDto>.Ok(contact));
    }

    // Seller updates their own profile
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Seller")]
    public async Task<ActionResult<ApiResponse<SellerDto>>> UpdateSeller(int id, [FromBody] SellerDto dto)
    {
        var updated = await _sellerService.UpdateSellerAsync(id, dto);
        return Ok(ApiResponse<SellerDto>.Ok(updated, "Seller updated successfully."));
    }

    // Only Admin can delete seller
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteSeller(int id)
    {
        await _sellerService.DeleteSellerAsync(id);
        return Ok(ApiResponse<bool>.Ok(true, "Seller deleted successfully."));
    }
}
