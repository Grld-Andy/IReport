namespace SafeZone.Modules.Identity.Core.DAL.Repositories;

internal class CompanyRepository(UsersDbContext _dbContext) : ICompanyRepository
{
    private readonly UsersDbContext dbContext = _dbContext;

    public async Task AddAsync(Company company, CancellationToken cancellationToken = default)
    {
        dbContext.Companies.Add(company);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}