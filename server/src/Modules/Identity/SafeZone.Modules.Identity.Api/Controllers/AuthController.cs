using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SafeZone.Modules.Identity.Core.Commands.Login;
using SafeZone.Modules.Identity.Core.Commands.Register;
using SafeZone.Modules.Identity.Core.Commands.ResetPassword;
using SafeZone.Modules.Identity.Core.DTO;
using SafeZone.Modules.Identity.Core.Queries.GetSingleUser;
using SafeZone.Modules.Identity.Core.Services;
using SafeZone.Shared.Abstractions.Contexts;
using SafeZone.Shared.Abstractions.Dispatchers;

namespace SafeZone.Modules.Identity.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
internal class AuthController(IDispatcher _dispatcher, IContext _context, ITokenStorage _tokenStorage) : ControllerBase
{
    private readonly IDispatcher dispatcher = _dispatcher;
    private readonly IContext context = _context;
    private readonly ITokenStorage tokenStorage = _tokenStorage;
    

    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> RegisterUser([FromBody] RegisterCommand command, CancellationToken cancellationToken)
    {
        await dispatcher.SendAsync(command, cancellationToken);
        return NoContent();
    }

    [HttpGet("me")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult> CheckAuth()
    {
        var currentUserId = context.Identity.Id;
        var userEmail = context.Identity.Claims["email"].First();
        Console.WriteLine($"====================== {userEmail}");
        var result = await dispatcher.QueryAsync(new GetSingleUserQuery(currentUserId));
        return Ok(result);
    }

    [HttpPost("reset-password")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordCommand command, CancellationToken cancellationToken)
    {
        await dispatcher.SendAsync(command, cancellationToken);
        return NoContent();
    }


    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<ActionResult<UserDetailsDto>> LoginUser([FromBody] LoginCommand command, CancellationToken cancellationToken)
    {
        var result = await dispatcher.SendAsync<LoginCommand, UserDetailsDto>(command, cancellationToken);
        var jwt = tokenStorage.Get();
        Response.Cookies.Append(
            "__access_token",
            jwt.AccessToken,
            new CookieOptions{ 
                HttpOnly=true,
                // Secure = true // uncomment once deployed over https
            }
        );
        return Ok(result);
    }

    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> LogoutUser()
    {
        Response.Cookies.Delete(
            "__access_token"
        );
        return NoContent();
    }
}
