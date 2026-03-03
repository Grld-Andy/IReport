using SafeZone.Shared.Infrastructure.Security;

namespace SafeZone.Modules.Identity.Core.Commands.Register;

internal class RegisterCommandHandler(IUserRepository _userRepository, IPasswordManager _passwordManager) : ICommandHandler<RegisterCommand>
{
    private readonly IUserRepository userRepository = _userRepository;
    private readonly IPasswordManager passwordManager = _passwordManager;

    public async Task HandleAsync(RegisterCommand command, CancellationToken cancellationToken = default)
    {
        var userDto = command.User;
        userDto.Password = passwordManager.Secure(userDto.Password);
        await userRepository.CreateAsync(UserMapper.ToEntity(userDto), cancellationToken);
    }
}