namespace SafeZone.Modules.Organization.Core.DTO;

internal class CreateTeamDto
{
    public Guid CompanyId { get; init; }
    public string Name { get; init; } = default!;
}