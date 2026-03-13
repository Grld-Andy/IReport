using SafeZone.Shared.Infrastructure.Postgres;

namespace SafeZone.Modules.Incident.Core.DAL.Repositories;

internal sealed class IncidentRepository(IncidentDbContext _dbcontext, IUserApiClient _userApiClient, IContext _context) : IIncidentRepository
{
    private readonly IncidentDbContext dbcontext = _dbcontext;
    private readonly IUserApiClient userApiClient = _userApiClient;
    private readonly IContext context = _context;

    public async Task SaveAsync(CancellationToken cancellationToken = default){
        await dbcontext.SaveChangesAsync(cancellationToken);
    }

    public async Task<IncidentEntity> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbcontext.Incidents
            .FirstOrDefaultAsync(i => i.Id == id, cancellationToken)
            ?? throw new NotFoundException("Incident", id);
    }

    public async Task AddAsync(IncidentEntity incident, CancellationToken cancellationToken = default)
    {
        await dbcontext.Incidents.AddAsync(incident, cancellationToken);
    }

    public Task UpdateAsync(IncidentEntity incident, CancellationToken cancellationToken = default)
    {
        dbcontext.Incidents.Update(incident);
        return Task.CompletedTask;
    }

    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbcontext.Incidents
            .AnyAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<Paged<IncidentDto>> GetAllIncidents(IPagedQuery query, string orderBy, string sortOrder, Dictionary<string, string>? filters, CancellationToken cancellationToken = default)
    {
        var incidentsQuery = dbcontext.Incidents
            .AsNoTracking()
            .AsQueryable();
        
        // filter
        if(filters?.Count > 0)
        {
            var role = context.Identity.Role;
            var id = context.Identity.Id;
            if(filters.TryGetValue("team", out var team) && !role.Equals("admin", StringComparison.InvariantCultureIgnoreCase))
            {
                Console.WriteLine($"================ current user team : {team}");
                if(role.Equals("supervisor"))
                {
                    Console.WriteLine("fetching for supervisor");
                    incidentsQuery = incidentsQuery.Where(i => EF.Functions.Like(i.Team.ToLower(), $"%{team.ToLower()}%"));
                }
                else
                {
                    Console.WriteLine("fetching for responder");
                    incidentsQuery = incidentsQuery.Where(i => i.ReporterId == id || i.AssignedToId == id);
                }
            }

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