using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EasyHousingSolution.IdentityService.Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using NUnit.Framework;

namespace EasyHousingSolution.Tests.Security;

[TestFixture]
public class JwtAuthenticationTests
{
    private const string SecretKey = "EasyHousingSolutionSuperSecretKey2026!@#$%^";
    private const string Issuer = "EasyHousingSolution";
    private const string Audience = "EasyHousingSolution";

    private IConfiguration _configuration = null!;
    private JwtTokenGenerator _tokenGenerator = null!;
    private TokenValidationParameters _validationParameters = null!;

    [SetUp]
    public void Setup()
    {
        var inMemorySettings = new Dictionary<string, string?>
        {
            { "Jwt:Key", SecretKey },
            { "Jwt:Issuer", Issuer },
            { "Jwt:Audience", Audience }
        };

        _configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();

        _tokenGenerator = new JwtTokenGenerator(_configuration);

        _validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = Issuer,
            ValidAudience = Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey)),
            ClockSkew = TimeSpan.Zero
        };
    }

    [Test]
    public void ValidateUserToken_FromUserRequest_InspectOutcome()
    {
        var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InNnMUBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJzZzFAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQnV5ZXIiLCJleHAiOjE3OTUxNjk5MjcsImlzcyI6IkVhc3lIb3VzaW5nU29sdXRpb24iLCJhdWQiOiJFYXN5SG91c2luZ1NvbHV0aW9uIn0.mDoslbaC4Us6xiE3VL7OfzpMN_-HBHCMp1FfMNDmD-Y";
        var handler = new JwtSecurityTokenHandler();
        var principal = handler.ValidateToken(token, _validationParameters, out var validatedToken);

        Assert.That(principal, Is.Not.Null);
        Assert.That(principal.IsInRole("Buyer"), Is.True);
        Console.WriteLine("User token validated successfully for " + principal.Identity?.Name);
    }

    [Test]
    public void GenerateToken_ForBuyer_ValidatesSuccessfullyAndContainsCorrectClaims()
    {
        // Arrange & Act
        var token = _tokenGenerator.GenerateToken("buyer@demo.com", "Buyer", 101);

        // Assert: Token is generated
        Assert.That(token, Is.Not.Null.And.Not.Empty);

        // Assert: Token can be validated with the standard validation parameters
        var handler = new JwtSecurityTokenHandler();
        var principal = handler.ValidateToken(token, _validationParameters, out var validatedToken);

        Assert.That(validatedToken, Is.Not.Null);
        Assert.That(principal.Identity?.IsAuthenticated, Is.True);
        Assert.That(principal.IsInRole("Buyer"), Is.True);
        Assert.That(principal.IsInRole("Seller"), Is.False);
        Assert.That(principal.IsInRole("Admin"), Is.False);

        var emailClaim = principal.FindFirst(ClaimTypes.Email)?.Value;
        Assert.That(emailClaim, Is.EqualTo("buyer@demo.com"));

        var profileIdClaim = principal.FindFirst("profileId")?.Value;
        Assert.That(profileIdClaim, Is.EqualTo("101"));
    }

    [Test]
    public void GenerateToken_ForSeller_HasSellerRoleAndCannotAccessBuyerRole()
    {
        // Arrange & Act
        var token = _tokenGenerator.GenerateToken("seller@demo.com", "Seller", 202);

        var handler = new JwtSecurityTokenHandler();
        var principal = handler.ValidateToken(token, _validationParameters, out _);

        // Assert
        Assert.That(principal.IsInRole("Seller"), Is.True);
        Assert.That(principal.IsInRole("Buyer"), Is.False);
        Assert.That(principal.FindFirst("profileId")?.Value, Is.EqualTo("202"));
    }

    [Test]
    public void GenerateToken_ForAdmin_HasAdminRole()
    {
        // Arrange & Act
        var token = _tokenGenerator.GenerateToken("admin@easysolution.com", "Admin", null);

        var handler = new JwtSecurityTokenHandler();
        var principal = handler.ValidateToken(token, _validationParameters, out _);

        // Assert
        Assert.That(principal.IsInRole("Admin"), Is.True);
        Assert.That(principal.IsInRole("Buyer"), Is.False);
        Assert.That(principal.IsInRole("Seller"), Is.False);
        Assert.That(principal.FindFirst("profileId"), Is.Null);
    }

    [Test]
    public void ValidateToken_WithTamperedPayload_FailsValidation()
    {
        // Arrange
        var token = _tokenGenerator.GenerateToken("buyer@demo.com", "Buyer", 1);
        var parts = token.Split('.');
        // Tamper with the payload (middle segment)
        var tamperedToken = $"{parts[0]}.eyJuYW1laWQiOiJoYWNrZXIifQ.{parts[2]}";

        var handler = new JwtSecurityTokenHandler();

        // Act & Assert
        Assert.Throws<SecurityTokenSignatureKeyNotFoundException>(() =>
        {
            handler.ValidateToken(tamperedToken, _validationParameters, out _);
        });
    }

    [Test]
    public void ValidateToken_WithWrongSigningKey_FailsValidation()
    {
        // Arrange
        var token = _tokenGenerator.GenerateToken("buyer@demo.com", "Buyer", 1);
        var wrongKeyParams = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = Issuer,
            ValidAudience = Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("AnotherCompletelyDifferentKey123456789!@#")),
            ClockSkew = TimeSpan.Zero
        };

        var handler = new JwtSecurityTokenHandler();

        // Act & Assert
        Assert.Throws<SecurityTokenSignatureKeyNotFoundException>(() =>
        {
            handler.ValidateToken(token, wrongKeyParams, out _);
        });
    }

    [Test]
    public void ValidateToken_WithMismatchedIssuer_FailsValidation()
    {
        // Arrange
        var token = _tokenGenerator.GenerateToken("buyer@demo.com", "Buyer", 1);
        var wrongIssuerParams = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = false,
            ValidateLifetime = false,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "FakeUntrustedIssuer",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey)),
            ClockSkew = TimeSpan.Zero
        };

        var handler = new JwtSecurityTokenHandler();

        // Act & Assert
        Assert.Throws<SecurityTokenInvalidIssuerException>(() =>
        {
            handler.ValidateToken(token, wrongIssuerParams, out _);
        });
    }

    [Test]
    public void ValidateToken_WithMismatchedAudience_FailsValidation()
    {
        // Arrange
        var token = _tokenGenerator.GenerateToken("buyer@demo.com", "Buyer", 1);
        var wrongAudienceParams = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = true,
            ValidateLifetime = false,
            ValidateIssuerSigningKey = true,
            ValidAudience = "FakeUntrustedAudience",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey)),
            ClockSkew = TimeSpan.Zero
        };

        var handler = new JwtSecurityTokenHandler();

        // Act & Assert
        Assert.Throws<SecurityTokenInvalidAudienceException>(() =>
        {
            handler.ValidateToken(token, wrongAudienceParams, out _);
        });
    }

    [Test]
    public void ValidateToken_ExpiredToken_FailsValidation()
    {
        // Arrange: Create an expired token manually
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiredToken = new JwtSecurityToken(
            issuer: Issuer,
            audience: Audience,
            claims: new List<Claim> { new(ClaimTypes.NameIdentifier, "test@demo.com") },
            expires: DateTime.UtcNow.AddMinutes(-10), // Expired 10 minutes ago
            signingCredentials: creds
        );
        var tokenString = new JwtSecurityTokenHandler().WriteToken(expiredToken);

        var handler = new JwtSecurityTokenHandler();

        // Act & Assert
        Assert.Throws<SecurityTokenExpiredException>(() =>
        {
            handler.ValidateToken(tokenString, _validationParameters, out _);
        });
    }
}
