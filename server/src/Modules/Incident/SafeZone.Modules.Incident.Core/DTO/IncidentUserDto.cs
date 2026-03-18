namespace SafeZone.Modules.Incident.Core.DTO;

internal class IncidentUserDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string Role { get; set; } = default!;

    public static implicit operator IncidentUserDto(IncidentUser v)
    {
        throw new NotImplementedException();
    }
}