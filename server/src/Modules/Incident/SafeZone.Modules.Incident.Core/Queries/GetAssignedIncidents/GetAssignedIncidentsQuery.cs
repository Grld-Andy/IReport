namespace SafeZone.Modules.Incident.Core.Queries.GetAssignedIncidents;

internal class GetAssignedIncidentsQuery() : PagedQuery<IncidentDto>
{
    public Guid UserId { get; set; }
}