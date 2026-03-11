using SafeZone.Modules.Incident.Core.Queries.GetIncidents;
using SafeZone.Shared.Infrastructure.Postgres;

namespace SafeZone.Modules.Incident.Core.DAL.Repositories;

internal sealed class IncidentRepository(IncidentDbContext _context, IUserApiClient _userApiClient) : IIncidentRepository
{
    private readonly IncidentDbContext context = _context;
    private readonly IUserApiClient userApiClient = _userApiClient;

    public async Task SaveAsync(CancellationToken cancellationToken = default){
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task<IncidentEntity> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await context.Incidents
            .FirstOrDefaultAsync(i => i.Id == id, cancellationToken)
            ?? throw new NotFoundException("Incident", id);
    }

    public async Task AddAsync(IncidentEntity incident, CancellationToken cancellationToken = default)
    {
        await context.Incidents.AddAsync(incident, cancellationToken);
    }

    public Task UpdateAsync(IncidentEntity incident, CancellationToken cancellationToken = default)
    {
        context.Incidents.Update(incident);
        return Task.CompletedTask;
    }

    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await context.Incidents
            .AnyAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<Paged<IncidentDto>> GetAllIncidents(IPagedQuery query, string orderBy, string sortOrder, Dictionary<string, string>? filters, CancellationToken cancellationToken = default)
    {
        var incidentsQuery = context.Incidents
            .AsNoTracking()
            .AsQueryable();
        
        // filter
        if(filters?.Count > 0)
        {
            if(filters.TryGetValue("filter", out var filter))
            {
                incidentsQuery = incidentsQuery.Where(i => EF.Functions.Like(i.Subject.Value, $"%{filter}%") || EF.Functions.Like(i.Description.Value, $"%{filter}%"));
            }
            if(filters.TryGetValue("userId", out var userId))
            {
                incidentsQuery = incidentsQuery.Where(x => x.AssignedToId == Guid.Parse(userId));
            }
            if(filters.TryGetValue("status", out var status))
            {
                IncidentStatus incidentStatus = status.ToLower() switch
                {
                    "open" => IncidentStatus.Open,
                    "inprogress" => IncidentStatus.InProgress,
                    "closed" => IncidentStatus.Closed,
                    "resolved" => IncidentStatus.Resolved,
                    _ => IncidentStatus.Open,
                };
                incidentsQuery = incidentsQuery.Where(x => x.Status != incidentStatus);
            }
        }

        incidentsQuery = (orderBy, sortOrder) switch
        {
            ("createdat", "asc") => incidentsQuery.OrderBy(x => x.CreatedAt),
            ("-createdat", "desc") => incidentsQuery.OrderByDescending(x => x.CreatedAt),
            ("severity", "asc") => incidentsQuery.OrderBy(x => x.Severity),
            ("-severity", "desc") => incidentsQuery.OrderByDescending(x => x.Severity),
            ("category", "asc") => incidentsQuery.OrderBy(x => x.Category),
            ("-category", "desc") => incidentsQuery.OrderByDescending(x => x.Category),
            _ => incidentsQuery.OrderByDescending(x => x.CreatedAt)
        };

        var incidentsPaged = await incidentsQuery.PaginateAsync(query, cancellationToken);

        var userIds = incidentsPaged.Items
            .Select(i => i.ReporterId)
            .Concat(incidentsPaged.Items
                .Where(i => i.AssignedToId.HasValue)
                .Select(i => i.AssignedToId!.Value)
            )
            .Distinct()
            .ToList();

        var users = await userApiClient.GetUsersByIds(userIds);
        var usersById = users.ToDictionary(u => u.Id);

        return incidentsPaged.Map(i => IncidentMapper.FromEntity(i, usersById));
    }
}