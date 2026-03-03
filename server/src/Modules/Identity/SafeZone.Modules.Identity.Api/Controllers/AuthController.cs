using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SafeZone.Modules.Identity.Core.Commands.Login;
using SafeZone.Modules.Identity.Core.Commands.Register;
using SafeZone.Modules.Identity.Core.Services;
using SafeZone.Shared.Abstractions.Dispatchers;

namespace SafeZone.Modules.Identity.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
internal class AuthController(IDispatcher _dispatcher, ITokenStorage _tokenStorage, CookieOptions _cookieOptions) : ControllerBase
{
    private readonly IDispatcher dispatcher = _dispatcher;
    private readonly ITokenStorage tokenStorage = _tokenStorage;
    private readonly CookieOptions cookieOptions = _cookieOptions;
    

    [HttpPost("register")]
    public async Task<IActionResult> RegisterUser([FromBody] RegisterCommand command, CancellationToken cancellationToken)
    {
        await dispatcher.SendAsync(command, cancellationToken);
        return NoContent();
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginUser([FromBody] LoginCommand command, CancellationToken cancellationToken)
    {
        await dispatcher.SendAsync(command, cancellationToken);
        var jwt = tokenStorage.Get();
        Response.Cookies.Append("__access_token", jwt.AccessToken, cookieOptions);
        return NoContent();
    }
}
