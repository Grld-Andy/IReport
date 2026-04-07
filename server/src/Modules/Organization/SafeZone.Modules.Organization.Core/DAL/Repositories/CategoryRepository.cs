using Microsoft.EntityFrameworkCore;

namespace SafeZone.Modules.Organization.Core.DAL.Repositories;

internal class CategoryRepository(OrganizationDbContext _organizationDbContext) : ICategoryRepository
{
    private readonly OrganizationDbContext domainDbContext = _organizationDbContext;
    
    public async Task AddListAsync(List<Category> categories, CancellationToken cancellationToken = default)
    {
        domainDbContext.Categories.AddRange(categories);
        await SaveAsync(cancellationToken);
    }

    public async Task<Category> GetByIdAsync(Guid Id, Guid CompanyId, CancellationToken cancellationToken = default)
    {
        return await domainDbContext.Categories.Where(t => t.CompanyId == CompanyId).FirstOrDefaultAsync(t => t.Id == Id, cancellationToken: cancellationToken)
            ?? throw new NotFoundException("Category not found");
    }

    public async Task SaveAsync(CancellationToken cancellationToken = default)
    {
        await domainDbContext.SaveChangesAsync(cancellationToken);
    }
}