namespace SafeZone.Modules.Organization.Core.Domain.Repositories;

internal interface ICategoryRepository
{
    Task AddListAsync(List<Category> categories, CancellationToken cancellationToken = default);
    Task SaveAsync(CancellationToken cancellationToken = default);
    Task<Category> GetByIdAsync(Guid Id, Guid CompanyId, CancellationToken cancellationToken = default);
}