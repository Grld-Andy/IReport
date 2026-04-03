using SafeZone.Modules.Identity.Core.Events.External;
using SafeZone.Modules.Identity.Core.Security;
using SafeZone.Shared.Abstractions.Contexts;

namespace SafeZone.Modules.Identity.Core.Commands.ResendOtp;

internal class ResendOtpCommandHandler(IUserRepository _usersRepository, IMessageBroker _messageBroker, IContext _context) : ICommandHandler<ResendOtpCommand>
{
    private readonly IUserRepository usersRepository = _usersRepository;
    private readonly IContext context = _context;
    private readonly IMessageBroker messageBroker = _messageBroker;

    public async Task HandleAsync(ResendOtpCommand command, CancellationToken cancellationToken = default)
    {
        User user = await usersRepository.GetByEmailAsync(command.Email, cancellationToken);
        if (user.Status.ToString().Equals("Active"))
        {
            throw new BadRequestException("Account already activated");
        }
        user.GenerateOTP();
        await usersRepository.SaveAsync(cancellationToken);

        _ = messageBroker.PublishAsync(new UserRegisteredEvent(new Guid(), user.Name, user.Email, user.Role.ToString(), user.Team, user.PhoneNumber, user.OTP, user.CompanyId), cancellationToken);
        _ = messageBroker.PublishAsync(new ActivityCreatedEvent(
            context.Identity.Id,
            context.Identity.Claims["Name"].First(),
            "created user",
            $"User: {user.Name}",
            "User"
        ), cancellationToken);
    }
}