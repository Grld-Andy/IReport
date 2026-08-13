using Microsoft.AspNetCore.Http;

namespace SafeZone.Modules.Identity.Api.Controllers;

internal static class AuthCookie
{
    public const string Name = "__access_token";

    public static CookieOptions Create(HttpRequest request)
    {
        var crossSite = request.IsHttps
            || string.Equals(
                Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"),
                "Production",
                StringComparison.OrdinalIgnoreCase);

        return new CookieOptions
        {
            HttpOnly = true,
            Secure = crossSite,
            SameSite = crossSite ? SameSiteMode.None : SameSiteMode.Lax,
            Path = "/",
        };
    }
}
