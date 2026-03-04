namespace SafeZone.Modules.Incident.Core.Queries.GetIncidents;

internal class GetIncidentsHandler(IncidentDbContext context) : IQueryHandler<GetIncidentsQuery, List<IncidentDto>>
{
    private readonly IncidentDbContext _context = context;

    public async Task<List<IncidentDto>> HandleAsync(
        GetIncidentsQuery query,
        CancellationToken cancellationToken = default)
    {
        return await _context.Incidents
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedAt)
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