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
using SafeZone.Shared.Abstractions.Contexts;

namespace SafeZone.Modules.Incident.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
internal class IncidentsController(IDispatcher _dispatcher, IContext _context) : ControllerBase
{
    private readonly IDispatcher dispatcher = _dispatcher;
    private readonly IContext context = _context;


    [HttpPost]
    public async Task<IActionResult> CreateIncident([FromBody] CreateIncidentCommand command)
    {
        var id = await dispatcher.SendAsync<CreateIncidentCommand, Guid>(command);
        return CreatedAtAction(nameof(GetIncidentById), new { id }, null);
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAllIncidents()
    {
        var result = await dispatcher.QueryAsync(new GetIncidentsQuery());

        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetIncidentById([FromRoute] Guid id)
    {
        var result = await dispatcher.QueryAsync(new GetIncidentByIdQuery(id));
        return Ok(result);
    }

    [HttpGet("assigned/me")]
    public async Task<IActionResult> GetIncidentsAssignedToUser()
    {
        var currentUserId = context.Identity.Id;
        var result = await dispatcher.QueryAsync(new GetAssignedIncidentsQuery(currentUserId));

        return Ok(result);
    }

    [HttpGet("open")]
    public async Task<IActionResult> GetOpenIncidents()
    {
        var result = await dispatcher.QueryAsync(new GetOpenIncidentsQuery());

        return Ok(result);
    }

    [HttpPatch("{id:guid}")]
    public async Task<IActionResult> UpdateIncident([FromRoute] Guid id, [FromBody] UpdateIncidentCommand command)
    {
        command = command with { IncidentId = id };
        await dispatcher.SendAsync(command);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteIncident([FromRoute] Guid id)
    {
        await dispatcher.SendAsync(new DeleteIncidentCommand(id));
        return NoContent();
    }

    [HttpPatch("{id:guid}/assign")]
    public async Task<IActionResult> AssignIncident([FromRoute] Guid id, [FromBody] Guid userId)
    {
        await dispatcher.SendAsync(new AssignIncidentCommand(id, userId));
        return NoContent();
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateIncidentStatus([FromRoute] Guid id, [FromBody] IncidentStatus status)
    {
        await dispatcher.SendAsync(new ChangeIncidentStatusCommand(id, status));
        return NoContent();
    }
}