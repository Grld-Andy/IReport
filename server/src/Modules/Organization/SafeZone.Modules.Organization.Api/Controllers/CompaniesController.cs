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
internal class CompaniesController(IDispatcher _dispatcher) : ControllerBase
{
    private readonly IDispatcher dispatcher = _dispatcher;

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult> CreateCompany([FromForm] CreateCompanyCommand command, CancellationToken cancellationToken)
    {
        await dispatcher.SendAsync(command, cancellationToken);
        return Created();
    }

    [HttpPut]
    [Authorize(Policy = "admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<ActionResult> UpdateCompany([FromForm] CompanyDto dto, CancellationToken cancellationToken)
    {
        await dispatcher.SendAsync(new UpdateCompanyCommand(dto.CompanyName, dto.Logo), cancellationToken);
        return NoContent();
    }
}