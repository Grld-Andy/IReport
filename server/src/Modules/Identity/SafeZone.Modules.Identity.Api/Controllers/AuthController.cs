using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using SafeZone.Modules.Identity.Core.Commands.ActivateAccount;
using SafeZone.Modules.Identity.Core.Commands.Login;
using SafeZone.Modules.Identity.Core.Commands.Register;
using SafeZone.Modules.Identity.Core.Commands.ResendOtp;
using SafeZone.Modules.Identity.Core.Commands.ResetPassword;
using SafeZone.Modules.Identity.Core.Commands.UpdateProfilePic;
using SafeZone.Modules.Identity.Core.DTO;
using SafeZone.Modules.Identity.Core.Queries.GetSingleUser;
using SafeZone.Modules.Identity.Core.Services;
using SafeZone.Shared.Abstractions.Contexts;
using SafeZone.Shared.Abstractions.Dispatchers;
using Swashbuckle.AspNetCore.Annotations;

namespace SafeZone.Modules.Identity.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
internal class AuthController(IDispatcher _dispatcher, IContext _context, ITokenStorage _tokenStorage) : ControllerBase
{
    private readonly IDispatcher dispatcher = _dispatcher;
    private readonly IContext context = _context;
    private readonly ITokenStorage tokenStorage = _tokenStorage;


    [HttpPost("register")]
    [SwaggerOperation("Register user")]
    [Authorize(Policy = "admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> RegisterUser([FromBody] UserDto dto, CancellationToken cancellationToken)
    {
        var userCreateDto = new UserCreateDto
        {
            Name = dto.Name,
            Email = dto.Email,
            Role = dto.Role,
            Team = dto.Team,
            PhoneNumber = dto.PhoneNumber,
            OTP = ""
        };
        await dispatcher.SendAsync(new RegisterCommand(userCreateDto), cancellationToken);
        return NoContent();
    }

    [HttpGet("me")]
    [SwaggerOperation("Get user identity")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<UserDetailsDto>> CheckAuth()
    {
        var currentUserId = context.Identity.Id;
        var result = await dispatcher.QueryAsync(new GetSingleUserQuery(currentUserId));
        return Ok(result);
    }


    [HttpPost("activate-account")]
    [SwaggerOperation("Activate account and set password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ActivateAccount([FromBody] ActivateAccountCommand command, CancellationToken cancellationToken)
    {
        await dispatcher.SendAsync(command, cancellationToken);
        return NoContent();
    }

    [Authorize]
    [HttpPost("reset-password")]
    [SwaggerOperation("Reset password for user")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordCommand command, CancellationToken cancellationToken)
    {
        await dispatcher.SendAsync(command, cancellationToken);
        Response.Cookies.Delete(
            "__access_token"
        );
        return NoContent();
    }

    [HttpPost("resend-otp")]
    [SwaggerOperation("Resend otp if email fails to send")]
    [Authorize(Policy = "admin")]
    public async Task<IActionResult> ResendOTP([FromBody] ResendOtpCommand command, CancellationToken cancellationToken)
    {
        await dispatcher.SendAsync(command, cancellationToken);
        return NoContent();
    }

    [HttpPost("login")]
    [EnableRateLimiting("fixed")]
    [SwaggerOperation("Login user (rate limit: 5 attempts per 2 minutes)")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<ActionResult<UserDetailsDto>> LoginUser([FromBody] LoginCommand command, CancellationToken cancellationToken)
    {
        var result = await dispatcher.SendAsync<LoginCommand, UserDetailsDto>(command, cancellationToken);
        var jwt = tokenStorage.Get();
        Response.Cookies.Append(
            "__access_token",
            jwt.AccessToken,
            new CookieOptions
            {
                HttpOnly = true,
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

    [HttpPost("upload-profile-pic")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult> UploadProfilePic(IFormFile file, CancellationToken cancellationToken)
    {
        var url = await dispatcher.SendAsync<UpdateProfilePicCommand, string>(new UpdateProfilePicCommand(file), cancellationToken);
        return Ok(new {Url = url});
    }
}
