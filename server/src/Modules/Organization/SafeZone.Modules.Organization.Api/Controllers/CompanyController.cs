using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SafeZone.Modules.Organization.Core.Commands.CreateCompany;
using SafeZone.Modules.Organization.Core.Commands.UpdateCompany;
using SafeZone.Shared.Abstractions.Dispatchers;

namespace SafeZone.Modules.Organization.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
internal class CompanyController(IDispatcher _dispatcher) : ControllerBase
{
    private readonly IDispatcher dispatcher = _dispatcher;

    [HttpPost]
    public async Task<ActionResult> CreateCompany([FromBody]string name, IFormFile logo, CancellationToken cancellationToken)
    {
        await dispatcher.SendAsync(new CreateCompanyCommand(name, logo), cancellationToken);
        return Created();
    }

    [HttpPut]
    public async Task<ActionResult> UpdateCompany([FromRoute] Guid id, [FromBody] string name, [FromForm] IFormFile logo, CancellationToken cancellationToken)
    {
        await dispatcher.SendAsync(new UpdateCompanyCommand(id, name, logo), cancellationToken);
        return Ok();
    }
}