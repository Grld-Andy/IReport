using Microsoft.AspNetCore.Mvc;
using SafeZone.Modules.Identity.Core.Domain.Entities;
using SafeZone.Modules.Identity.Core.DTO;
using SafeZone.Modules.Identity.Core.Queries.GetSingleUser;
using SafeZone.Modules.Identity.Core.Queries.GetUsers;
using SafeZone.Shared.Abstractions.Dispatchers;
using SafeZone.Shared.Abstractions.Queries;

namespace SafeZone.Modules.Identity.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
internal class UsersController(IDispatcher _dispatcher) : ControllerBase
{
    private readonly IDispatcher dispatcher = _dispatcher;
    

    [HttpGet]
    public async Task<ActionResult<Paged<UserDetailsDto>>> GetAllUsers([FromQuery] GetUsersQuery query, CancellationToken cancellationToken)
    {
        var result = await dispatcher.QueryAsync(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<User>> LoginUser([FromRoute] Guid id, CancellationToken cancellationToken)
    {
        var user = await dispatcher.QueryAsync(new GetSingleUserQuery(id), cancellationToken);
        return Ok(user);
    }
}
