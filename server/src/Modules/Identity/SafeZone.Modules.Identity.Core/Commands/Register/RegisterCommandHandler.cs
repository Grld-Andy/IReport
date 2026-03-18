using SafeZone.Modules.Identity.Core.Events;
using SafeZone.Shared.Abstractions.Contexts;
using SafeZone.Shared.Abstractions.Messaging;
using SafeZone.Shared.Infrastructure.Security;

namespace SafeZone.Modules.Identity.Core.Commands.Register;

internal class RegisterCommandHandler(IUserRepository _userRepository, IMessageBroker _messageBroker, IPasswordManager _passwordManager, IContext _context) : ICommandHandler<RegisterCommand>
{
    private readonly IUserRepository userRepository = _userRepository;
    private readonly IContext context = _context;
    private readonly IMessageBroker messageBroker = _messageBroker;

    private readonly IPasswordManager passwordManager = _passwordManager;

    public async Task HandleAsync(RegisterCommand command, CancellationToken cancellationToken = default)
    {
        var userDto = command.User;
        if(userDto.Password != userDto.ConfirmPassword)
        {
            throw new BadRequestException("Passwords do not match, please try again.");
        }
        userDto.Password = passwordManager.Secure(userDto.Password);

        if(context.Identity.Role == "admin")
        {
            userDto.Team = "Admin";
        }
        var id = await userRepository.CreateAsync(UserMapper.ToEntity(userDto), cancellationToken);

        _ = messageBroker.PublishAsync(new UserRegistered(id, userDto.Name, userDto.Email, userDto.Role), cancellationToken);
    }
}