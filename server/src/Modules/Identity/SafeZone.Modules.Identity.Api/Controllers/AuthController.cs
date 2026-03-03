using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SafeZone.Modules.Identity.Core.Commands.Login;
using SafeZone.Modules.Identity.Core.Commands.Register;
using SafeZone.Modules.Identity.Core.Services;
using SafeZone.Shared.Abstractions.Dispatchers;

namespace SafeZone.Modules.Identity.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
internal class AuthController(IDispatcher _dispatcher, ITokenStorage _tokenStorage) : ControllerBase
{
    private readonly IDispatcher dispatcher = _dispatcher;
    private readonly ITokenStorage tokenStorage = _tokenStorage;
    

    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> RegisterUser([FromBody] RegisterCommand command, CancellationToken cancellationToken)
    {
        await dispatcher.SendAsync(command, cancellationToken);
        return NoContent();
    }

    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> LoginUser([FromBody] LoginCommand command, CancellationToken cancellationToken)
    {
        await dispatcher.SendAsync(command, cancellationToken);
        var jwt = tokenStorage.Get();
        Response.Cookies.Append(
            "__access_token",
            jwt.AccessToken,
            new CookieOptions{ 
                HttpOnly=true,
                // Secure = true // uncomment once deployes over https
            }
        );
        return NoContent();
    }

    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> LogoutUser(CancellationToken cancellationToken)
    {
        return NoContent();
    }
}
