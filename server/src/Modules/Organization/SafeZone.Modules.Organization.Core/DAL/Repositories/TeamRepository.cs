namespace SafeZone.Modules.Organization.Core.DAL.Repositories;

internal class TeamRepository : ITeamRepository
{
    public Task AddAsync(Team team, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task<List<Team>> GetAllAsync(Guid CompanyId, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task<Team> GetByIdAsync(Guid Id, Guid CompanyId, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task SaveAsync(CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }
}