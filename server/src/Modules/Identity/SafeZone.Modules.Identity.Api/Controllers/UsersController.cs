using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SafeZone.Modules.Identity.Core.Commands.ChangeStatus;
using SafeZone.Modules.Identity.Core.DTO;
using SafeZone.Modules.Identity.Core.Queries.GetSingleUser;
using SafeZone.Modules.Identity.Core.Queries.GetUsers;
using SafeZone.Shared.Abstractions.Dispatchers;
using SafeZone.Shared.Abstractions.Queries;
using Swashbuckle.AspNetCore.Annotations;

namespace SafeZone.Modules.Identity.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
internal class UsersController(IDispatcher _dispatcher) : ControllerBase
{
    private readonly IDispatcher dispatcher = _dispatcher;
    

    [Authorize(Policy = "admin")]
    [HttpGet]
    [SwaggerOperation("Get all users (admin only)")]
    public async Task<ActionResult<Paged<UserDetailsDto>>> GetAllUsers([FromQuery] GetUsersQuery query, CancellationToken cancellationToken)
    {
        var result = await dispatcher.QueryAsync(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [SwaggerOperation("Get single user by id")]
    public async Task<ActionResult<UserDetailsDto>> GetUser([FromRoute] Guid id, CancellationToken cancellationToken)
    {
        var user = await dispatcher.QueryAsync(new GetSingleUserQuery(id), cancellationToken);
        return Ok(user);
    }

    [HttpPatch("updateStatus/{id:guid}")]
    [SwaggerOperation("Update user status (Inactive, Active, Suspended)")]
    public async Task<ActionResult> UpdateUserStatus([FromRoute] Guid id, [FromBody] ChangeStatusCommand command, CancellationToken cancellationToken)
    {
        await dispatcher.SendAsync(command with {Id = id}, cancellationToken);
        return Ok();
    }
}
