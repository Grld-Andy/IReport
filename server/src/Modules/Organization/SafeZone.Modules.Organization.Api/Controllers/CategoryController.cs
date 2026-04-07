using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SafeZone.Modules.Organization.Core.Commands.CreateCategories;
using SafeZone.Modules.Organization.Core.Domain.Entities;
using SafeZone.Modules.Organization.Core.Queries.GetCategories;
using SafeZone.Shared.Abstractions.Dispatchers;

namespace SafeZone.Modules.Organization.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
internal class CategoryController(IDispatcher _dispatcher) : ControllerBase
{
    private readonly IDispatcher dispatcher = _dispatcher;

    [HttpPost]
    [Authorize(Policy = "admin")]
    public async Task<ActionResult> CreateCategories([FromBody]CreateCategoriesCommand command, CancellationToken cancellationToken)
    {
        await dispatcher.SendAsync(command, cancellationToken);
        return Created();
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories(CancellationToken cancellationToken)
    {
        var categories = await dispatcher.QueryAsync(new GetCategoriesQuery(), cancellationToken);
        return Ok(categories);
    }
}