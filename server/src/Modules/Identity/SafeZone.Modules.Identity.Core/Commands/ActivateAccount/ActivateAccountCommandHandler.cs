using SafeZone.Modules.Identity.Core.Events.External;
using SafeZone.Shared.Infrastructure.Security;

namespace SafeZone.Modules.Identity.Core.Commands.ActivateAccount;

internal class ActivateAccountCommandHandler(IUserRepository _usersRepository, IMessageBroker _messageBroker, IPasswordManager _passwordManager) : ICommandHandler<ActivateAccountCommand>
{
    private readonly IUserRepository usersRepository = _usersRepository;
    private readonly IMessageBroker messageBroker = _messageBroker;
    private readonly IPasswordManager passwordManager = _passwordManager;

    public async Task HandleAsync(ActivateAccountCommand command, CancellationToken cancellationToken = default)
    {
        User user = await usersRepository.GetByEmailAsync(command.Email, cancellationToken);
        if (user.Status.ToString().Equals("Active"))
        {
            throw new BadRequestException("Account already activated");
        }

        if(command.Password != command.PasswordConfirm)
        {
            throw new BadRequestException("Passwords do not match, please try again.");
        }
        var hashedPassword = passwordManager.Secure(command.Password);

        if(command.OTP.Equals(user.OTP)){
            user.ActivateAccount(hashedPassword, new DateTime());
        }
        else
        {
            throw new BadRequestException("Activation failed, please try again with valid credentials.");
        }
        await usersRepository.SaveAsync(cancellationToken);

        _ = messageBroker.PublishAsync(new ActivityCreatedEvent(
            new Guid(),
            command.Email.Split('@')[0],
            "activated account",
            $"Account: {command.Email}",
            "User",
            user.CompanyId
        ), cancellationToken);
    }
}