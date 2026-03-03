using Microsoft.IdentityModel.Tokens;

namespace SafeZone.Shared.Infrastructure.Auth.JWT;

internal sealed record SecurityKeyDetails(SecurityKey Key, string Algorithm);



