namespace SafeZone.Modules.Organization.Core.Domain.Repositories;

internal interface ITeamRepository
{
    Task AddAsync(Team team, CancellationToken cancellationToken = default);
    Task SaveAsync(CancellationToken cancellationToken = default);
    Task<Team> GetByIdAsync(Guid Id, Guid CompanyId, CancellationToken cancellationToken = default);
    Task<List<Team>> GetAllAsync(Guid CompanyId, CancellationToken cancellationToken = default);
}