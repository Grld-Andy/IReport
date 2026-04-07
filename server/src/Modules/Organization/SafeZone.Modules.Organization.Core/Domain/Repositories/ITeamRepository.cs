namespace SafeZone.Modules.Organization.Core.Domain.Repositories;

internal interface ITeamRepository
{
    Task AddListAsync(List<Team> teams, CancellationToken cancellationToken = default);
    Task SaveAsync(CancellationToken cancellationToken = default);
    Task<Team> GetByIdAsync(Guid Id, Guid CompanyId, CancellationToken cancellationToken = default);
}