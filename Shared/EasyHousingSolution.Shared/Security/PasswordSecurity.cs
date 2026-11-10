using System.Security.Cryptography;

namespace EasyHousingSolution.Shared.Security;

public static class PasswordSecurity
{
    private const int SaltSize = 16;
    private const int KeySize = 32;
    private const int Iterations = 10000;

    public static string HashPassword(string password)
    {
        using var algorithm = new Rfc2898DeriveBytes(
            password,
            SaltSize,
            Iterations,
            HashAlgorithmName.SHA256);

        var key = Convert.ToBase64String(algorithm.GetBytes(KeySize));
        var salt = Convert.ToBase64String(algorithm.Salt);

        return $"{salt}.{key}";
    }

    public static bool VerifyPassword(string password, string hashedPassword)
    {
        var parts = hashedPassword.Split('.', 2);
        if (parts.Length != 2)
        {
            // Fallback for plain-text comparison if unhashed
            return password == hashedPassword;
        }

        var salt = Convert.FromBase64String(parts[0]);
        var key = parts[1];

        using var algorithm = new Rfc2898DeriveBytes(
            password,
            salt,
            Iterations,
            HashAlgorithmName.SHA256);

        var keyToCheck = Convert.ToBase64String(algorithm.GetBytes(KeySize));
        return CryptographicOperations.FixedTimeEquals(
            Convert.FromBase64String(keyToCheck),
            Convert.FromBase64String(key));
    }
}
