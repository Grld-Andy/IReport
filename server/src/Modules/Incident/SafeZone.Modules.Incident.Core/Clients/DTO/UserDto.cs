namespace SafeZone.Modules.Incident.Core.Clients.DTO;

internal class UserDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = default!;
    public string Email { get; init; } = default!;
}