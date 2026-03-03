using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SafeZone.Modules.Identity.Core.Domain.Entities;
using SafeZone.Modules.Identity.Core.DTO;
using SafeZone.Modules.Identity.Core.Queries.GetSingleUser;
using SafeZone.Modules.Identity.Core.Queries.GetUsers;
using SafeZone.Modules.Identity.Core.Services;
using SafeZone.Shared.Abstractions.Dispatchers;
using SafeZone.Shared.Abstractions.Queries;

namespace SafeZone.Modules.Identity.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
internal class UsersController(IDispatcher _dispatcher, ITokenStorage _tokenStorage, CookieOptions _cookieOptions) : ControllerBase
{
    private readonly IDispatcher dispatcher = _dispatcher;
    private readonly ITokenStorage tokenStorage = _tokenStorage;
    private readonly CookieOptions cookieOptions = _cookieOptions;
    

    [HttpGet]
    public async Task<ActionResult<Paged<UserDetailsDto>>> GetAllUsers([FromRoute] GetUsersQuery query, CancellationToken cancellationToken)
    {
        var result = await dispatcher.QueryAsync(query, cancellationToken);
        return result;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<User>> LoginUser([FromRoute] Guid id, CancellationToken cancellationToken)
    {
        var user = await dispatcher.QueryAsync(new GetSingleUserQuery(id), cancellationToken);
        return Ok(user);
    }
}
