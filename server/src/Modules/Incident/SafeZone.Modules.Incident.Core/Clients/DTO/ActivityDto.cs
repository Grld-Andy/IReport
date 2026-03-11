namespace SafeZone.Modules.Incident.Core.Clients.DTO;

internal class ActivityDto
{
    public Guid? ActorId { get; set; }
    public string ActorName { get; set; } = default!;
    public string Action { get; set; } = default!;
    public string Details { get; set; } = default!;
    public string Module { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
}