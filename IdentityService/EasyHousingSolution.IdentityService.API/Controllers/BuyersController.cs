using EasyHousingSolution.IdentityService.Application.DTOs;
using EasyHousingSolution.IdentityService.Application.Interfaces;
using EasyHousingSolution.Shared.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EasyHousingSolution.IdentityService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BuyersController : ControllerBase
{
    private readonly IBuyerService _buyerService;

    public BuyersController(IBuyerService buyerService)
    {
        _buyerService = buyerService;
    }

    // Only Admin can see/view all buyers
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<IEnumerable<BuyerDto>>>> GetAllBuyers()
    {
        var buyers = await _buyerService.GetAllBuyersAsync();
        return Ok(ApiResponse<IEnumerable<BuyerDto>>.Ok(buyers));
    }

    [HttpGet("{id:int}")]
    [Authorize(Roles = "Buyer,Admin")]
    public async Task<ActionResult<ApiResponse<BuyerDto>>> GetBuyerById(int id)
    {
        var buyer = await _buyerService.GetBuyerByIdAsync(id);
        if (buyer == null)
        {
            return NotFound(ApiResponse<BuyerDto>.Fail($"Buyer with ID {id} not found."));
        }
        return Ok(ApiResponse<BuyerDto>.Ok(buyer));
    }

    [HttpGet("by-email/{email}")]
    [Authorize(Roles = "Buyer,Admin")]
    public async Task<ActionResult<ApiResponse<BuyerDto>>> GetBuyerByEmail(string email)
    {
        var buyer = await _buyerService.GetBuyerByEmailAsync(email);
        if (buyer == null)
        {
            return NotFound(ApiResponse<BuyerDto>.Fail($"Buyer with email '{email}' not found."));
        }
        return Ok(ApiResponse<BuyerDto>.Ok(buyer));
    }

    // Buyer updates their own profile
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Buyer")]
    public async Task<ActionResult<ApiResponse<BuyerDto>>> UpdateBuyer(int id, [FromBody] BuyerDto dto)
    {
        var updated = await _buyerService.UpdateBuyerAsync(id, dto);
        return Ok(ApiResponse<BuyerDto>.Ok(updated, "Buyer updated successfully."));
    }

    // Only Admin can delete buyer
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteBuyer(int id)
    {
        await _buyerService.DeleteBuyerAsync(id);
        return Ok(ApiResponse<bool>.Ok(true, "Buyer deleted successfully."));
    }
}
