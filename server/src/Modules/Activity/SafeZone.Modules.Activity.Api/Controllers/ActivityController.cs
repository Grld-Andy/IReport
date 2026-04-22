using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SafeZone.Modules.Activity.Core.Domain.Entities;
using SafeZone.Modules.Activity.Core.Domain.Repositories;
using Swashbuckle.AspNetCore.Annotations;

namespace SafeZone.Modules.Activity.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
internal class ActivitiesController(IActivityRepository repository) : ControllerBase
{
    private readonly IActivityRepository _repository = repository;

    [HttpGet]
    [SwaggerOperation("Get list of activities for company (default: top 5)")]
    public async Task<ActionResult<List<ActivityEntity>>> Get(
        [FromQuery] int limit = 5,
        CancellationToken ct = default)
    {
        var activities = await _repository.GetAsync(limit, ct);
        return Ok(activities);
    }
}