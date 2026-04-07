using Microsoft.EntityFrameworkCore;
using SafeZone.Modules.Organization.Core.DAL;
using SafeZone.Shared.Abstractions.Contexts;
using SafeZone.Shared.Abstractions.Queries;

namespace SafeZone.Modules.Organization.Core.Queries.GetTeamsQueries;

internal class GetTeamsQueryHandler(OrganizationDbContext _organizationDbContext, IContext _context) : IQueryHandler<GetTeamsQuery, IEnumerable<Team>>
{
    private readonly OrganizationDbContext dbContext = _organizationDbContext;
    private readonly IContext context = _context;
    private Guid GetCompanyId() => Guid.Parse(context.Identity.Claims["CompanyId"].First());

    public async Task<IEnumerable<Team>> HandleAsync(GetTeamsQuery query, CancellationToken cancellationToken = default)
    {
        var teams = await dbContext.Teams.AsNoTracking().Where(c => c.CompanyId == GetCompanyId()).ToListAsync(cancellationToken);
        return teams;
    }
}