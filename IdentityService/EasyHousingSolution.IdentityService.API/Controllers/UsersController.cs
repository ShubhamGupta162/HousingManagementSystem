using EasyHousingSolution.IdentityService.Application.DTOs;
using EasyHousingSolution.IdentityService.Application.Interfaces;
using EasyHousingSolution.Shared.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EasyHousingSolution.IdentityService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly IAuthService _authService;

    public UsersController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<UserDto>>>> GetAllUsers()
    {
        var users = await _authService.GetAllUsersAsync();
        return Ok(ApiResponse<IEnumerable<UserDto>>.Ok(users));
    }

    [HttpGet("{username}")]
    public async Task<ActionResult<ApiResponse<UserDto>>> GetUserByUsername(string username)
    {
        var user = await _authService.GetUserByUsernameAsync(username);
        if (user == null)
        {
            return NotFound(ApiResponse<UserDto>.Fail($"User '{username}' not found."));
        }
        return Ok(ApiResponse<UserDto>.Ok(user));
    }
}
