namespace SafeZone.Modules.Incident.Core.Queries.GetIncidentById;

internal class GetIncidentByIdHandler(IncidentDbContext context) : IQueryHandler<GetIncidentByIdQuery, IncidentDto>
{
    private readonly IncidentDbContext _context = context;

    public async Task<IncidentDto> HandleAsync(
        GetIncidentByIdQuery query,
        CancellationToken cancellationToken = default)
    {
        var incidents = await _context.Incidents
            .AsNoTracking()
            .Where(x => x.Id == query.Id)
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
            .FirstOrDefaultAsync(cancellationToken) ?? throw new NotFoundException("Incident", query.Id);
        
        return incidents;
    }

}