using Microsoft.Extensions.Logging;
using SafeZone.Shared.Abstractions.Time;
using SafeZone.Shared.Infrastructure;
using SafeZone.Shared.Infrastructure.Security;

namespace SafeZone.Modules.Identity.Core.DAL;

internal class UsersInitializer
    (
        ILogger<UsersInitializer> _logger, IMessageBroker _messageBroker,
        IPasswordManager _passwordManager,
        IClock _clock, UsersDbContext _usersDbContext
    )
    : IInitializer
{
    private readonly IPasswordManager passwordManager = _passwordManager;
    private readonly UsersDbContext usersDbContext = _usersDbContext;
    private readonly IClock clock = _clock;
    private readonly IMessageBroker messageBroker = _messageBroker;
    private readonly ILogger<UsersInitializer> logger = _logger;

    public async Task InitAsync()
    {
        await AddCompany();
        await AddAdmin();
    }

    private async Task AddCompany()
    {
        if(await usersDbContext.Companies.AnyAsync())
        {
            return;
        }

        var company = Company.AddCompany(Guid.Parse("fac586f8-1ffa-4cca-9bb0-224736bbc5a4"), "SafeZone", ".png");
        usersDbContext.Companies.Add(company);
        await usersDbContext.SaveChangesAsync();
        logger.LogInformation($"[INIT] [USER] Created companies successfully");
    }

    private async Task AddAdmin()
    {
        if(await usersDbContext.Users.AnyAsync()){
            return;
        }
        var hashedPassword = passwordManager.Secure("admin");
        var user = User.Register(
            name: "Andy Ansong",
            email: "andyansong3@gmail.com",
            password: hashedPassword,
            role: UserRole.From("admin"), "Admin",
            phoneNumber: "0123456789",
            otp: "",
            companyId: Guid.Parse("fac586f8-1ffa-4cca-9bb0-224736bbc5a4"),
            now: clock.CurrentDate()
        );
        user.ActivateAccount(hashedPassword, clock.CurrentDate());
        usersDbContext.Users.Add(user);
        await usersDbContext.SaveChangesAsync();
        _ = messageBroker.PublishAsync(new UserRegisteredEvent(user.Id, user.Name, user.Email, user.Role.Value, user.Team, user.PhoneNumber, user.OTP));
        logger.LogInformation($"[INIT] [USER] Created users successfully");
    }
}