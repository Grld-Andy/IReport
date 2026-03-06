namespace SafeZone.Modules.Incident.Core.Domain.Repositories;

internal interface IIncidentRepository
{
    Task<IncidentEntity> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Paged<IncidentDto>> GetAllIncidents(IPagedQuery query, Dictionary<string, string>? filters, CancellationToken cancellation = default);
    Task AddAsync(IncidentEntity incident, CancellationToken cancellationToken = default);
    Task UpdateAsync(IncidentEntity incident, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);
    Task SaveAsync(CancellationToken cancellationToken = default);
}