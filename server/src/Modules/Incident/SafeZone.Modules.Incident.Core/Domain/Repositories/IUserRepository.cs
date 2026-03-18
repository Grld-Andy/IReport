namespace SafeZone.Modules.Incident.Core.Domain.Repositories;

internal interface IUserRepository
{
    Task SaveAsync(CancellationToken cancellationToken = default);
    Task<IncidentUser> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddUserAsync(Guid id, CreateIncidentUserDto dto, CancellationToken cancellationToken = default);
    Task UpdateUserAsync(IncidentUser user, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);
    Task DeleteUserAsync(Guid id, CancellationToken cancellationToken = default);
}