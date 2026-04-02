using Microsoft.EntityFrameworkCore;
using SafeZone.Modules.Organization.Core.DAL;
using SafeZone.Shared.Abstractions.Queries;

namespace SafeZone.Modules.Organization.Core.Queries.GetTeamsQueries;

internal class GetTeamsQueryHandler(OrganizationDbContext _organizationDbContext) : IQueryHandler<GetTeamsQuery, IEnumerable<Team>>
{
    private readonly OrganizationDbContext dbContext = _organizationDbContext;

    public async Task<IEnumerable<Team>> HandleAsync(GetTeamsQuery query, CancellationToken cancellationToken = default)
    {
        var teams = await dbContext.Teams.AsNoTracking().ToListAsync(cancellationToken);
        return teams;
    }
}