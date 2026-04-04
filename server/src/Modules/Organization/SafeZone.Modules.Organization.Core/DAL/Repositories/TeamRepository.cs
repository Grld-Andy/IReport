using Microsoft.EntityFrameworkCore;
using SafeZone.Shared.Abstractions.Exceptions.ExceptionClasses;

namespace SafeZone.Modules.Organization.Core.DAL.Repositories;

internal class TeamRepository(OrganizationDbContext _organizationDbContext) : ITeamRepository
{
    private readonly OrganizationDbContext domainDbContext = _organizationDbContext;

    public async Task AddAsync(Team team, CancellationToken cancellationToken = default)
    {
        domainDbContext.Teams.Add(team);
        await SaveAsync(cancellationToken);
    }
    
    public async Task AddListAsync(List<Team> teams, CancellationToken cancellationToken = default)
    {
        domainDbContext.Teams.AddRange(teams);
        await SaveAsync(cancellationToken);
    }

    public async Task<Team> GetByIdAsync(Guid Id, Guid CompanyId, CancellationToken cancellationToken = default)
    {
        return await domainDbContext.Teams.Where(t => t.CompanyId == CompanyId).FirstOrDefaultAsync(t => t.Id == Id, cancellationToken: cancellationToken)
            ?? throw new NotFoundException("Team not found");
    }

    public async Task SaveAsync(CancellationToken cancellationToken = default)
    {
        await domainDbContext.SaveChangesAsync(cancellationToken);
    }
}