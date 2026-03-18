namespace SafeZone.Modules.Incident.Core.DAL.Repositories;

internal sealed class UserRepository(IncidentDbContext _dbcontext) : IUserRepository
{
    private readonly IncidentDbContext dbcontext = _dbcontext;

    public async Task SaveAsync(CancellationToken cancellationToken = default)
    {
        await dbcontext.SaveChangesAsync(cancellationToken);
    }

    public async Task<IncidentUser> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbcontext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(i => i.Id == id, cancellationToken)
            ?? throw new NotFoundException("User", id);
    }

    public async Task AddUserAsync(Guid id, CreateIncidentUserDto dto, CancellationToken cancellationToken = default)
    {
        var user = IncidentUser.Create(id, dto.Name, dto.Email, dto.Role);
        await dbcontext.Users.AddAsync(user, cancellationToken);
    }

    public Task UpdateUserAsync(IncidentUser user, CancellationToken cancellationToken = default)
    {
        dbcontext.Users.Update(user);
        return Task.CompletedTask;
    }

    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbcontext.Users
            .AnyAsync(u => u.Id == id, cancellationToken);
    }

    public async Task DeleteUserAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var user = await dbcontext.Users
            .FirstOrDefaultAsync(u => u.Id == id, cancellationToken)
            ?? throw new NotFoundException("User", id);

        dbcontext.Users.Remove(user);
        await SaveAsync(cancellationToken);
    }
}