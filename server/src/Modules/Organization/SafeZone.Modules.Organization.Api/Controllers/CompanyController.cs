using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult> CreateCompany([FromForm] CompanyDto dto, CancellationToken cancellationToken)
    {
        await dispatcher.SendAsync(new CreateCompanyCommand(dto.Name, dto.Logo), cancellationToken);
        return Created();
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = "admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult> UpdateCompany([FromRoute] Guid id, [FromForm] CompanyDto dto, CancellationToken cancellationToken)
    {
        await dispatcher.SendAsync(new UpdateCompanyCommand(id, dto.Name, dto.Logo), cancellationToken);
        return Ok();
    }
}