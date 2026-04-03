namespace SafeZone.Modules.Incident.Core.DTO;

internal class CreateIncidentUserDto
{
    public string Name { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string Role { get; set; } = default!;
    public Guid CompanyId { get; set; } = default!;
}