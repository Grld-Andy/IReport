using SafeZone.Shared.Abstractions.Auth;

namespace SafeZone.Modules.Identity.Core.Services;

public interface ITokenStorage
{
    void Set(JsonWebToken jwt);
    JsonWebToken Get();
}