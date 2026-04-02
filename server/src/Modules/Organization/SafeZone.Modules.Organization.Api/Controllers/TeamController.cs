using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SafeZone.Modules.Organization.Core.Commands.CreateTeam;
using SafeZone.Modules.Organization.Core.Domain.Entities;
using SafeZone.Modules.Organization.Core.Queries.GetTeamsQueries;
using SafeZone.Shared.Abstractions.Dispatchers;

namespace SafeZone.Modules.Organization.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
internal class TeamController(IDispatcher _dispatcher) : ControllerBase
{
    private readonly IDispatcher dispatcher = _dispatcher;

    [HttpPost]
    [Authorize(Policy = "admin")]
    public async Task<ActionResult> CreateTeam([FromBody]CreateTeamCommand command, CancellationToken cancellationToken)
    {
        await dispatcher.SendAsync(command, cancellationToken);
        return Created();
    }

    [HttpPost("bulk")]
    [Authorize(Policy = "admin")]
    public async Task<ActionResult> CreateTeams([FromBody]CreateTeamCommand command, CancellationToken cancellationToken)
    {
        await dispatcher.SendAsync(command, cancellationToken);
        return Created();
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Team>>> GetTeams(CancellationToken cancellationToken)
    {
        var teams = await dispatcher.QueryAsync(new GetTeamsQuery(), cancellationToken);
        return Ok(teams);
    }
}
