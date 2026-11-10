using EasyHousingSolution.IdentityService.Application.DTOs;
using EasyHousingSolution.IdentityService.Application.Interfaces;
using EasyHousingSolution.Shared.Common;
using Microsoft.AspNetCore.Mvc;

namespace EasyHousingSolution.IdentityService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register-buyer")]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> RegisterBuyer([FromBody] RegisterBuyerDto dto)
    {
        var result = await _authService.RegisterBuyerAsync(dto);
        return CreatedAtAction(nameof(RegisterBuyer), ApiResponse<AuthResponseDto>.Ok(result, "Buyer registered successfully."));
    }

    [HttpPost("register-seller")]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> RegisterSeller([FromBody] RegisterSellerDto dto)
    {
        var result = await _authService.RegisterSellerAsync(dto);
        return CreatedAtAction(nameof(RegisterSeller), ApiResponse<AuthResponseDto>.Ok(result, "Seller registered successfully."));
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Login([FromBody] LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto);
        return Ok(ApiResponse<AuthResponseDto>.Ok(result, "Login successful."));
    }
}
