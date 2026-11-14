using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace EasyHousingSolution.Shared.Security;

public static class JwtAuthenticationExtensions
{
    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var secretKey = configuration["Jwt:Key"] ?? "EasyHousingSolutionSuperSecretKey2026!@#$%^";
        var issuer = configuration["Jwt:Issuer"] ?? "EasyHousingSolution";
        var audience = configuration["Jwt:Audience"] ?? "EasyHousingSolution";

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false;
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = issuer,
                ValidAudience = audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
            };

            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
                    if (!string.IsNullOrEmpty(authHeader))
                    {
                        var trimmed = authHeader.Trim();
                        if (trimmed.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                        {
                            context.Token = trimmed.Substring("Bearer ".Length).Trim();
                        }
                        else if (!trimmed.Contains(' ') && trimmed.Split('.').Length == 3)
                        {
                            // Handles raw JWT token entered directly without "Bearer " prefix
                            context.Token = trimmed;
                        }
                    }
                    return Task.CompletedTask;
                }
            };
        });

        services.AddAuthorization();

        return services;
    }
}
