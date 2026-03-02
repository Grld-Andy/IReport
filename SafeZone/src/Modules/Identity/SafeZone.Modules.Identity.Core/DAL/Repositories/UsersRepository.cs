using Microsoft.EntityFrameworkCore;
using SafeZone.Shared.Infrastructure.Security;

namespace SafeZone.Modules.Identity.Core.DAL.Repositories;

internal class UsersRepository(UsersDbContext _dbContext, IPasswordManager _passwordManager) : IUserRepository
{
    private readonly UsersDbContext dbContext = _dbContext;
    private readonly IPasswordManager passwordManager = _passwordManager;

    public async Task CreateAsync(User userDto, CancellationToken cancellationToken = default)
    {
        var hashedPassword = passwordManager.Secure(userDto.Password);
        var user = User.Register(
            id: userDto.Id,
            name: userDto.Name,
            email: userDto.Email,
            password: hashedPassword,
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

    public async Task<List<User>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await dbContext.Users.AsNoTracking().ToListAsync(cancellationToken: cancellationToken);
    }

    public async Task<User> GetAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var user = await dbContext.Users.AsNoTracking().SingleOrDefaultAsync(u => u.Id == id, cancellationToken: cancellationToken)
            ?? throw new UserNotFoundException(id);
        return user;
    }

    public async Task SaveAsync(CancellationToken cancellationToken = default)
    {
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}