using System.Security.Cryptography;

namespace SafeZone.Modules.Identity.Core.Security;
public static class OTPGenerator
{
    public static string GenerateOTP()
    {
        byte[] randomNumber = new byte[4];

        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomNumber);
        }

        int value = Math.Abs(BitConverter.ToInt32(randomNumber, 0));

        int otp = value % 1000000;

        return otp.ToString("D6");
    }
}