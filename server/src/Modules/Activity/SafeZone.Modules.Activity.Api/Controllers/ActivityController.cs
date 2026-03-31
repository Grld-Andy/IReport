using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SafeZone.Modules.Activity.Core.Domain.Repositories;

namespace SafeZone.Modules.Activity.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
internal class ActivitiesController(IActivityRepository repository) : ControllerBase
{
    private readonly IActivityRepository _repository = repository;

    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] int limit = 5,
        CancellationToken ct = default)
    {
        var activities = await _repository.GetAsync(limit, ct);
        return Ok(activities);
    }
}