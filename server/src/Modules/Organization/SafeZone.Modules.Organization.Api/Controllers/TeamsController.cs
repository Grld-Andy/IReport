using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SafeZone.Modules.Organization.Core.Commands.CreateTeams;
using SafeZone.Modules.Organization.Core.Queries.GetTeamsQueries;
using SafeZone.Shared.Abstractions.Dispatchers;

namespace SafeZone.Modules.Organization.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
internal class TeamsController(IDispatcher _dispatcher) : ControllerBase
{
    private readonly IDispatcher dispatcher = _dispatcher;

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [Authorize(Policy = "admin")]
    public async Task<ActionResult> CreateTeams([FromBody]CreateTeamsCommand command, CancellationToken cancellationToken)
    {
        await dispatcher.SendAsync(command, cancellationToken);
        return Created();
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<string>>> GetTeams(CancellationToken cancellationToken)
    {
        var teams = await dispatcher.QueryAsync(new GetTeamsQuery(), cancellationToken);
        return Ok(teams);
    }
}
