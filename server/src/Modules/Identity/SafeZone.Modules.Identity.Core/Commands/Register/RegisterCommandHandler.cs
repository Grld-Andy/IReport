using SafeZone.Shared.Abstractions.Contexts;
using SafeZone.Shared.Infrastructure.Security;

namespace SafeZone.Modules.Identity.Core.Commands.Register;

internal class RegisterCommandHandler(IUserRepository _userRepository, IPasswordManager _passwordManager, IContext _context) : ICommandHandler<RegisterCommand>
{
    private readonly IUserRepository userRepository = _userRepository;
    private readonly IContext context = _context;
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
        await userRepository.CreateAsync(UserMapper.ToEntity(userDto), cancellationToken);
    }
}