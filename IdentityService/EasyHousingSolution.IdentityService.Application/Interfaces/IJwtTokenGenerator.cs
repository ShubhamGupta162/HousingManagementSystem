namespace EasyHousingSolution.IdentityService.Application.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(string userName, string userType, int? profileId);
}
