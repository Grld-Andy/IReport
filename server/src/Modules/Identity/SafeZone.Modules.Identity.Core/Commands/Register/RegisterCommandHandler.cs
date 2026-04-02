using SafeZone.Modules.Identity.Core.Events.External;
using SafeZone.Modules.Identity.Core.Security;
using SafeZone.Shared.Abstractions.Contexts;

namespace SafeZone.Modules.Identity.Core.Commands.Register;

internal class RegisterCommandHandler(IUserRepository _userRepository, IMessageBroker _messageBroker, IContext _context) : ICommandHandler<RegisterCommand>
{
    private readonly IUserRepository userRepository = _userRepository;
    private readonly IContext context = _context;
    private readonly IMessageBroker messageBroker = _messageBroker;

    public async Task HandleAsync(RegisterCommand command, CancellationToken cancellationToken = default)
    {
        await userRepository.EnsureEmailNotTakenAsync(command.User.Email, cancellationToken);
        var userDto = command.User;
        userDto.OTP = OTPGenerator.GenerateOTP();

        if(context.Identity.Role == "admin" && userDto.Role == "admin")
        {
            userDto.Team = "Admin";
        }
        var id = await userRepository.CreateAsync(UserMapper.ToEntity(userDto), cancellationToken);

        _ = messageBroker.PublishAsync(new UserRegisteredEvent(id, userDto.Name, userDto.Email, userDto.Role, userDto.Team, userDto.PhoneNumber, userDto.OTP), cancellationToken);
        _ = messageBroker.PublishAsync(new ActivityCreatedEvent(
            context.Identity.Id,
            context.Identity.Claims["Name"].First(),
            "created user",
            $"User: {userDto.Name}",
            "User"
        ), cancellationToken);
    }
}