using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SafeZone.Modules.Organization.Core.Commands.CreateCompany;
using SafeZone.Modules.Organization.Core.Commands.UpdateCompany;
using SafeZone.Modules.Organization.Core.DTO;
using SafeZone.Shared.Abstractions.Dispatchers;

namespace SafeZone.Modules.Organization.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
internal class CompanyController(IDispatcher _dispatcher) : ControllerBase
{
    private readonly IDispatcher dispatcher = _dispatcher;

    [HttpPost]
    public async Task<ActionResult> CreateCompany([FromForm] CompanyDto dto, CancellationToken cancellationToken)
    {
        await dispatcher.SendAsync(new CreateCompanyCommand(dto.Name, dto.Logo), cancellationToken);
        return Created();
    }

    [HttpPut]
    [Authorize(Policy = "admin")]
    public async Task<ActionResult> UpdateCompany([FromRoute] Guid id, [FromForm] CompanyDto dto, CancellationToken cancellationToken)
    {
        await dispatcher.SendAsync(new UpdateCompanyCommand(id, dto.Name, dto.Logo), cancellationToken);
        return Ok();
    }
}