namespace SafeZone.Modules.Incident.Core.Queries.GetOpenIncidents;

internal class GetOpenIncidentsHandler(IncidentDbContext _context) : IQueryHandler<GetOpenIncidentsQuery, List<IncidentDto>>
{
    private readonly IncidentDbContext context = _context;

    public async Task<List<IncidentDto>> HandleAsync(
        GetOpenIncidentsQuery query,
        CancellationToken cancellationToken = default)
    {
        return await context.Incidents
            .AsNoTracking()
            .Where(x => x.Status == IncidentStatus.Open)
            .Select(x => new IncidentDto
            {
                Id = x.Id,
                Subject = x.Subject.Value,
                Description = x.Description.Value,
                Category = x.Category.ToString(),
                Severity = x.Severity.ToString(),
                Status = x.Status.ToString(),
                ReporterId = x.ReporterId,
                AssignedToId = x.AssignedToId,
                Latitude = x.Location.Latitude,
                Longitude = x.Location.Longitude,
                LocationDetails = x.Location.ExtraDetails,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .ToListAsync(cancellationToken);
    }
}