using Microsoft.AspNetCore.Mvc;
using SafeZone.Modules.Incident.Core.Commands.CreateIncident;
using SafeZone.Modules.Incident.Core.Commands.DeleteIncident;
using SafeZone.Modules.Incident.Core.Commands.AssignIncident;
using SafeZone.Modules.Incident.Core.Commands.ChangeIncidentStatus;
using SafeZone.Modules.Incident.Core.Commands.UpdateIncident;
using SafeZone.Modules.Incident.Core.Queries.GetIncidentById;
using SafeZone.Modules.Incident.Core.Queries.GetIncidents;
using SafeZone.Modules.Incident.Core.Queries.GetOpenIncidents;
using SafeZone.Modules.Incident.Core.Queries.GetAssignedIncidents;
using SafeZone.Shared.Abstractions.Dispatchers;
using SafeZone.Modules.Incident.Core.Domain.Enums;

namespace SafeZone.Modules.Incident.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
internal class IncidentsController(IDispatcher dispatcher) : ControllerBase
{
    private readonly IDispatcher _dispatcher = dispatcher;

    [HttpGet]
    public async Task<IActionResult> GetAllIncidents()
    {
        var result = await _dispatcher.QueryAsync(new GetIncidentsQuery());
        if (!result.Any())
            return NoContent();

        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetIncidentById([FromRoute] Guid id)
    {
        var result = await _dispatcher.QueryAsync(new GetIncidentByIdQuery(id));
        return Ok(result);
    }

    [HttpGet("assigned/me")]
    public async Task<IActionResult> GetIncidentsAssignedToUser()
    {
        var currentUserId = HttpContext.User.GetUserId();
        var result = await _dispatcher.QueryAsync(new GetAssignedIncidentsQuery(currentUserId));

        if (!result.Any())
            return NoContent();

        return Ok(result);
    }

    [HttpGet("open")]
    public async Task<IActionResult> GetOpenIncidents()
    {
        var result = await _dispatcher.QueryAsync(new GetOpenIncidentsQuery());
        if (!result.Any())
            return NoContent();

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateIncident([FromBody] CreateIncidentCommand command)
    {
        var id = await _dispatcher.SendAsync<CreateIncidentCommand, Guid>(command);
        return CreatedAtAction(nameof(GetIncidentById), new { id }, null);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateIncident([FromRoute] Guid id, [FromBody] UpdateIncidentCommand command)
    {
        command = command with { IncidentId = id };
        await _dispatcher.SendAsync(command);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteIncident([FromRoute] Guid id)
    {
        await _dispatcher.SendAsync(new DeleteIncidentCommand(id));
        return NoContent();
    }

    [HttpPut("{id:guid}/assign")]
    public async Task<IActionResult> AssignIncident([FromRoute] Guid id, [FromBody] Guid userId)
    {
        await _dispatcher.SendAsync(new AssignIncidentCommand(id, userId));
        return NoContent();
    }

    [HttpPut("{id:guid}/status")]
    public async Task<IActionResult> UpdateIncidentStatus([FromRoute] Guid id, [FromBody] IncidentStatus status)
    {
        await _dispatcher.SendAsync(new ChangeIncidentStatusCommand(id, status));
        return NoContent();
    }
}