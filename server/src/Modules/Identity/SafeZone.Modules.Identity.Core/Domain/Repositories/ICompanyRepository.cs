namespace SafeZone.Modules.Identity.Core.Domain.Repositories;

internal interface ICompanyRepository
{
    Task AddAsync(Company company, CancellationToken cancellationToken = default);
}