namespace SafeZone.Modules.Incident.Core.DAL.Repositories;

internal sealed class UserRepository(IncidentDbContext _dbcontext, IContext _context) : IUserRepository
{
    private readonly IncidentDbContext dbcontext = _dbcontext;
    private readonly IContext context = _context;
    private Guid GetCompanyId() => Guid.Parse(context.Identity.Claims["CompanyId"].First());

    public async Task SaveAsync(CancellationToken cancellationToken = default)
    {
        await dbcontext.SaveChangesAsync(cancellationToken);
    }

    public async Task<IncidentUser> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbcontext.Users
            .AsNoTracking()
            .Where(u => u.CompanyId == GetCompanyId())
            .FirstOrDefaultAsync(i => i.Id == id, cancellationToken)
            ?? throw new NotFoundException("User not found");
    }

    public async Task AddUserAsync(Guid id, CreateIncidentUserDto dto, CancellationToken cancellationToken = default)
    {
        var user = IncidentUser.Create(id, dto.Name, dto.Email, dto.Role, dto.CompanyId);
        await dbcontext.Users.AddAsync(user, cancellationToken);
        await SaveAsync(cancellationToken);
    }

    public async Task UpdateUserAsync(IncidentUser user, CancellationToken cancellationToken = default)
    {
        dbcontext.Users.Update(user);
        await SaveAsync(cancellationToken);
    }

    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbcontext.Users
            .Where(u => u.CompanyId == GetCompanyId())
            .AnyAsync(u => u.Id == id, cancellationToken);
    }

    public async Task DeleteUserAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var user = await dbcontext.Users
            .Where(u => u.CompanyId == GetCompanyId())
            .FirstOrDefaultAsync(u => u.Id == id, cancellationToken)
            ?? throw new NotFoundException("User", id);

        dbcontext.Users.Remove(user);
        await SaveAsync(cancellationToken);
    }
}