namespace SafeZone.Modules.Incident.Core.Queries.GetIncidents;

internal class GetIncidentsQuery() : PagedQuery<IncidentDto>{
    public string? Filter { get; set; } = "";
}