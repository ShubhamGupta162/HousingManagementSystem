using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EasyHousingSolution.SellerService.Application.DTOs;
using EasyHousingSolution.SellerService.Application.Interfaces;
using EasyHousingSolution.Shared.Common;

namespace EasyHousingSolution.SellerService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SellersController : ControllerBase
{
    private readonly ISellerAppService _sellerAppService;

    public SellersController(ISellerAppService sellerAppService)
    {
        _sellerAppService = sellerAppService;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<SellerResponseDto>>> CreateSeller([FromBody] CreateSellerDto dto)
    {
        var result = await _sellerAppService.CreateSellerAsync(dto);
        return CreatedAtAction(nameof(GetSellerById), new { id = result.SellerId }, ApiResponse<SellerResponseDto>.Ok(result, "Seller created successfully"));
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<IEnumerable<SellerResponseDto>>>> GetAllSellers()
    {
        var result = await _sellerAppService.GetAllSellersAsync();
        return Ok(ApiResponse<IEnumerable<SellerResponseDto>>.Ok(result));
    }

    [HttpGet("{id:int}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<SellerResponseDto>>> GetSellerById(int id)
    {
        var result = await _sellerAppService.GetSellerByIdAsync(id);
        if (result == null) return NotFound(ApiResponse<SellerResponseDto>.Fail("Seller not found"));
        return Ok(ApiResponse<SellerResponseDto>.Ok(result));
    }

    [HttpGet("{id:int}/contact")]
    public async Task<ActionResult<ApiResponse<SellerContactDto>>> GetSellerContact(int id)
    {
        var result = await _sellerAppService.GetSellerContactAsync(id);
        if (result == null) return NotFound(ApiResponse<SellerContactDto>.Fail("Seller contact details not found"));
        return Ok(ApiResponse<SellerContactDto>.Ok(result));
    }

    [HttpGet("by-user/{userId:int}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<SellerResponseDto>>> GetSellerByUserId(int userId)
    {
        var result = await _sellerAppService.GetSellerByUserIdAsync(userId);
        if (result == null) return NotFound(ApiResponse<SellerResponseDto>.Fail("Seller not found for this user"));
        return Ok(ApiResponse<SellerResponseDto>.Ok(result));
    }
}
