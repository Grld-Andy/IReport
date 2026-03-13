namespace SafeZone.Modules.Incident.Core.Queries.GetIncidents;

internal class GetIncidentsQuery() : PagedQuery<IncidentDto>{
    public string? Filter { get; set; } = "";
    public string? Team { get; set; } = "";
}