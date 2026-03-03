using Microsoft.EntityFrameworkCore;
using SafeZone.Shared.Infrastructure.Postgres;

namespace SafeZone.Modules.Identity.Core.DAL.Repositories;

internal class UsersRepository(UsersDbContext _dbContext) : IUserRepository
{
    private readonly UsersDbContext dbContext = _dbContext;

    public async Task CreateAsync(User userDto, CancellationToken cancellationToken = default)
    {
        var user = User.Register(
            id: userDto.Id,
            name: userDto.Name,
            email: userDto.Email,
            password: userDto.Password,
            role: userDto.Role,
            now: DateTime.Now
        );

        dbContext.Users.Add(user);
        await SaveAsync(cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var user = await dbContext.Users.AsNoTracking().SingleOrDefaultAsync(u => u.Id == id, cancellationToken: cancellationToken);
        if(user is null){
            return false;
        }

        dbContext.Users.Remove(user);
        await SaveAsync(cancellationToken);
        return true;
    }

    public async Task<bool> SoftDeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var user = await dbContext.Users.AsNoTracking().SingleOrDefaultAsync(u => u.Id == id, cancellationToken: cancellationToken);
        if(user is null){
            return false;
        }

        user.ChangeStatus(UserStatus.Deleted, DateTime.Now);
        await SaveAsync(cancellationToken);
        return true;
    }

    public async Task<Paged<User>> GetAllAsync(IPagedQuery query, CancellationToken cancellationToken = default)
    {
        return await dbContext.Users.AsNoTracking().PaginateAsync(query, cancellationToken: cancellationToken);
    }

    public async Task<User> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var user = await dbContext.Users.AsNoTracking().SingleOrDefaultAsync(u => u.Id == id, cancellationToken: cancellationToken)
            ?? throw new UserNotFoundException(id);
        return user;
    }

    public async Task<User> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        var user = await dbContext.Users.AsNoTracking().SingleOrDefaultAsync(u => u.Email.Value.Equals(email, StringComparison.InvariantCultureIgnoreCase), cancellationToken: cancellationToken)
            ?? throw new UserNotFoundException(email);
        return user;
    }

    public async Task SaveAsync(CancellationToken cancellationToken = default)
    {
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}