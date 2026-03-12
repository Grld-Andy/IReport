using Microsoft.AspNetCore.Mvc;
using SafeZone.Modules.Activity.Core.Domain.Repositories;

namespace SafeZone.Modules.Activity.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
internal class ActivitiesController(IActivityRepository repository) : ControllerBase
{
    private readonly IActivityRepository _repository = repository;

    [HttpGet]
    public async Task<IActionResult> GetLatest(
        [FromQuery] int limit = 5,
        CancellationToken ct = default)
    {
        var activities = await _repository.GetLatestAsync(limit, ct);
        return Ok(activities);
    }
}