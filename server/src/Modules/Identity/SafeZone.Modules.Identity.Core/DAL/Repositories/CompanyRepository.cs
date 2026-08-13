namespace SafeZone.Modules.Identity.Core.DAL.Repositories;

internal class CompanyRepository(UsersDbContext _dbContext) : ICompanyRepository
{
    private readonly UsersDbContext dbContext = _dbContext;

    public async Task AddAsync(Company company, CancellationToken cancellationToken = default)
    {
        dbContext.Companies.Add(company);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<Company> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var company = await dbContext.Companies.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        return company ?? throw new NotFoundException("Company not found");
    }

    public Task SaveAsync(CancellationToken cancellationToken = default)
        => dbContext.SaveChangesAsync(cancellationToken);
}
