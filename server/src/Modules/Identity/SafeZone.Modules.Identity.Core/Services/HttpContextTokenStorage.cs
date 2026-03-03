using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using SafeZone.Shared.Abstractions.Auth;

namespace SafeZone.Modules.Identity.Core.Services;

internal sealed class HttpContextTokenStorage(IHttpContextAccessor httpContextAccessor) : ITokenStorage
{
    private const string TokenKey = "jwt";
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

    public void Set(JsonWebToken jwt) => _httpContextAccessor.HttpContext?.Items.TryAdd(TokenKey, jwt);

    public JsonWebToken Get()
    {
        if (_httpContextAccessor.HttpContext is null)
        {
            return null;
        }

        if (_httpContextAccessor.HttpContext.Items.TryGetValue(TokenKey, out var jwt))
        {
            return jwt as JsonWebToken;
        }

        return null;
    }
}