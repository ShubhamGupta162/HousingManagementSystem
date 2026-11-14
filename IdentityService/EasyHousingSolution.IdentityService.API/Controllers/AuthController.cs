using EasyHousingSolution.IdentityService.Application.DTOs;
using EasyHousingSolution.IdentityService.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EasyHousingSolution.IdentityService.API.Controllers;

[ApiController]
[Route("api/identity")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register-buyer")]
    [Tags("Buyer")]
    public async Task<IActionResult> RegisterBuyer(RegisterBuyerDto dto)
    {
        try
        {
            var result = await _authService.RegisterBuyerAsync(dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("register-seller")]
    [Tags("Seller")]
    public async Task<IActionResult> RegisterSeller(RegisterSellerDto dto)
    {
        try
        {
            var result = await _authService.RegisterSellerAsync(dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("login")]
    [Tags("User")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        try
        {
            var result = await _authService.LoginAsync(dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
