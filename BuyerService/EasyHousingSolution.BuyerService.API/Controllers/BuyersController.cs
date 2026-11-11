using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EasyHousingSolution.BuyerService.Application.DTOs;
using EasyHousingSolution.BuyerService.Application.Interfaces;
using EasyHousingSolution.Shared.Common;

namespace EasyHousingSolution.BuyerService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BuyersController : ControllerBase
{
    private readonly IBuyerAppService _buyerAppService;

    public BuyersController(IBuyerAppService buyerAppService)
    {
        _buyerAppService = buyerAppService;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<BuyerResponseDto>>> CreateBuyer([FromBody] CreateBuyerDto dto)
    {
        var result = await _buyerAppService.CreateBuyerAsync(dto);
        return CreatedAtAction(nameof(GetBuyerById), new { id = result.BuyerId }, ApiResponse<BuyerResponseDto>.Ok(result, "Buyer created successfully"));
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<IEnumerable<BuyerResponseDto>>>> GetAllBuyers()
    {
        var result = await _buyerAppService.GetAllBuyersAsync();
        return Ok(ApiResponse<IEnumerable<BuyerResponseDto>>.Ok(result));
    }

    [HttpGet("{id:int}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<BuyerResponseDto>>> GetBuyerById(int id)
    {
        var result = await _buyerAppService.GetBuyerByIdAsync(id);
        if (result == null) return NotFound(ApiResponse<BuyerResponseDto>.Fail("Buyer not found"));
        return Ok(ApiResponse<BuyerResponseDto>.Ok(result));
    }

    [HttpGet("by-user/{userId:int}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<BuyerResponseDto>>> GetBuyerByUserId(int userId)
    {
        var result = await _buyerAppService.GetBuyerByUserIdAsync(userId);
        if (result == null) return NotFound(ApiResponse<BuyerResponseDto>.Fail("Buyer not found for this user"));
        return Ok(ApiResponse<BuyerResponseDto>.Ok(result));
    }
}
