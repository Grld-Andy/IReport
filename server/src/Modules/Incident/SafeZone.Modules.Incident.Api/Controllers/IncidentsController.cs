using Microsoft.AspNetCore.Mvc;
using SafeZone.Shared.Abstractions.Dispatchers;

namespace SafeZone.Modules.Identity.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
internal class IncidentsController() : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAllIncidents()
    {
        return NoContent();
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetIncidentById([FromRoute] Guid id)
    {
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteIncident([FromRoute] Guid id)
    {
        return NoContent();
    }

    [HttpPatch("{id:guid}/assign")]
    public async Task<IActionResult> AssignIncident([FromRoute] Guid id)
    {
        return NoContent();
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateIncidentStatus([FromRoute] Guid id)
    {
        return NoContent();
    }

    [HttpPatch("/assigned/me")]
    public async Task<IActionResult> GetIncidentsAssignedToUser([FromRoute] Guid id)
    {
        return NoContent();
    }
}
