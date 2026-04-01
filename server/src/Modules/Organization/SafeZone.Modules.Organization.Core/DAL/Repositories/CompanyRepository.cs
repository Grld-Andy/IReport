using Microsoft.EntityFrameworkCore;

namespace SafeZone.Modules.Organization.Core.DAL.Repositories;

internal class CompanyRepository(OrganizationDbContext _organizationDbContext) : ICompanyRepository
{
    private readonly OrganizationDbContext domainDbContext = _organizationDbContext;

    public async Task AddAsync(Company company, CancellationToken cancellationToken = default)
    {
        domainDbContext.Companies.Add(company);
        await SaveAsync(cancellationToken);
    }

    public async Task<Company> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await domainDbContext.Companies.FirstOrDefaultAsync(c => c.Id == id, cancellationToken: cancellationToken)
            ?? throw new NotFoundException("Company not found");
    }

    public async Task SaveAsync(CancellationToken cancellationToken = default)
    {
        await domainDbContext.SaveChangesAsync(cancellationToken);
    }
}