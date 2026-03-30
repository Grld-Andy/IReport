namespace SafeZone.Modules.Incident.Core.DTO;

internal class IncidentUserDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string Role { get; set; } = default!;

    public static implicit operator IncidentUserDto(IncidentUser incidentUser)
    {
        return new IncidentUserDto
        {
            Id = incidentUser.Id,
            Name = incidentUser.Name,
            Email = incidentUser.Email,
            Role = incidentUser.Role,
        };
    }
}