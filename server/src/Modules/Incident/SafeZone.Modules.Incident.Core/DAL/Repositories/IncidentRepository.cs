using SafeZone.Modules.Incident.Core.Clients;
using SafeZone.Shared.Infrastructure.Postgres;

namespace SafeZone.Modules.Incident.Core.DAL.Repositories;

internal sealed class IncidentRepository(IncidentDbContext _context, IUserApiClient _userApiClient) : IIncidentRepository
{
    private readonly IncidentDbContext context = _context;
    private readonly IUserApiClient userApiClient = _userApiClient;

    public async Task<IncidentDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var incident = await context.Incidents
            .FirstOrDefaultAsync(i => i.Id == id, cancellationToken)
            ?? throw new NotFoundException("Incident", id);
        
        List<Guid> usersIds = [incident.ReporterId];
        if (incident.AssignedToId.HasValue)
        {
            usersIds.Add(incident.AssignedToId.Value);
        }
        var users = await userApiClient.GetUsersByIds(usersIds);
        var usersDict = users.ToDictionary(u => u.Id);
        return IncidentMapper.FromEntity(incident, usersDict);
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

    public async Task<Paged<IncidentDto>> GetAllIncidents(IPagedQuery query, Dictionary<string, string>? filters, CancellationToken cancellationToken = default)
    {
        var incidentsQuery = context.Incidents
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedAt)
            .AsQueryable();
        
        if(filters?.Count > 0)
        {
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