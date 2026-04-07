namespace SafeZone.Modules.Organization.Core.DTO;

internal class CreateCategoryDto
{
    public Guid CompanyId { get; init; }
    public string Name { get; init; } = default!;
}