using Microsoft.AspNetCore.Http;

namespace SafeZone.Modules.Organization.Core.DTO;

internal class CompanyDto
{
    public string Name { get; init; } = default!;
    public IFormFile Logo { get; init; } = default!;
}