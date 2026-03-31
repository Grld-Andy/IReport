using Microsoft.Extensions.Logging;
using SafeZone.Shared.Abstractions.Time;
using SafeZone.Shared.Infrastructure;
using SafeZone.Shared.Infrastructure.Security;

namespace SafeZone.Modules.Identity.Core.DAL;

internal class UsersInitializer(ILogger<UsersInitializer> _logger, IPasswordManager _passwordManager, IClock _clock, UsersDbContext _usersDbContext) : IInitializer
{
    private readonly IPasswordManager passwordManager = _passwordManager;
    private readonly UsersDbContext usersDbContext = _usersDbContext;
    private readonly IClock clock = _clock;
    private readonly ILogger<UsersInitializer> logger = _logger;

    public async Task InitAsync()
    {
        await AddAdmin();
    }

    private async Task AddAdmin()
    {
        if(await usersDbContext.Users.AnyAsync()){
            return;
        }
        var hashedPassword = passwordManager.Secure("admin");
        var user = User.Register("Andy Ansong", "andyansong3@gmail.com", hashedPassword, UserRole.From("admin"), "Admin", "", clock.CurrentDate());
        user.ActivateAccount(hashedPassword, clock.CurrentDate());
        usersDbContext.Users.Add(user);
        await usersDbContext.SaveChangesAsync();
        logger.LogInformation($"[INIT] [USER] Created users successfully");
    }
}