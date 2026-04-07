using Microsoft.EntityFrameworkCore;
using SafeZone.Modules.Organization.Core.DAL;
using SafeZone.Shared.Abstractions.Contexts;
using SafeZone.Shared.Abstractions.Queries;

namespace SafeZone.Modules.Organization.Core.Queries.GetCategories;

internal class GetCategoriesQueryHandler(OrganizationDbContext _organizationDbContext, IContext _context) : IQueryHandler<GetCategoriesQuery, IEnumerable<Category>>
{
    private readonly OrganizationDbContext dbContext = _organizationDbContext;
    private readonly IContext context = _context;
    private Guid GetCompanyId() => Guid.Parse(context.Identity.Claims["CompanyId"].First());

    public async Task<IEnumerable<Category>> HandleAsync(GetCategoriesQuery query, CancellationToken cancellationToken = default)
    {
        var categories = await dbContext.Categories.AsNoTracking().Where(c => c.CompanyId == GetCompanyId()).ToListAsync(cancellationToken);
        return categories;
    }
}