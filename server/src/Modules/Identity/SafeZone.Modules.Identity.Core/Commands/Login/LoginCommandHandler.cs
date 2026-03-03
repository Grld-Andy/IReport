using SafeZone.Shared.Infrastructure.Auth.JWT;
using SafeZone.Shared.Infrastructure.Security;

namespace SafeZone.Modules.Identity.Core.Commands.Login;

internal class LoginCommandHandler(IUserRepository _userRepository, IPasswordManager _passwordManager, IJsonWebTokenManager _jsonWebTokenManager) : ICommandHandler<LoginCommand>
{
    private readonly IUserRepository userRepository = _userRepository;
    private readonly IPasswordManager passwordManager = _passwordManager;
    private readonly IJsonWebTokenManager jsonWebTokenManager = _jsonWebTokenManager;

    public async Task HandleAsync(LoginCommand command, CancellationToken cancellationToken = default)
    {
        var user = await userRepository.GetByEmailAsync(command.Email.ToLowerInvariant(), cancellationToken);

        if(!passwordManager.IsValid(command.Password, user.Password))
        {
            throw new BadRequestException("Login failed, please try again with valid credentials.");
        }

        // generate jwt token for user
        var token = jsonWebTokenManager.CreateToken(user.Id.ToString(), user.Email, user.Role.ToString());
    }
}