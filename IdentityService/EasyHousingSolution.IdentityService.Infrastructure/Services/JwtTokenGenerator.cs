using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EasyHousingSolution.IdentityService.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace EasyHousingSolution.IdentityService.Infrastructure.Services;

public class JwtTokenGenerator : IJwtTokenGenerator
{
    private readonly IConfiguration _configuration;

    public JwtTokenGenerator(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(string userName, string userType, int? profileId)
    {
        var secretKey = _configuration["Jwt:Key"] ?? "EasyHousingSolutionSuperSecretKey2026!@#$%^";
        var issuer = _configuration["Jwt:Issuer"] ?? "EasyHousingSolution";
        var audience = _configuration["Jwt:Audience"] ?? "EasyHousingSolution";

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userName),
            new(ClaimTypes.Email, userName),
            new(ClaimTypes.Role, userType)
        };

        if (profileId.HasValue)
        {
            claims.Add(new Claim("profileId", profileId.Value.ToString()));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
