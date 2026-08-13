namespace SafeZone.Modules.Identity.Core.Domain.Repositories;

internal interface ICompanyRepository
{
    Task AddAsync(Company company, CancellationToken cancellationToken = default);
    Task<Company> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task SaveAsync(CancellationToken cancellationToken = default);
}