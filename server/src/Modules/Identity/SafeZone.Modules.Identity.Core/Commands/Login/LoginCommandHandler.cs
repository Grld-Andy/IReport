using System.Runtime.CompilerServices;
using SafeZone.Modules.Identity.Core.Services;
using SafeZone.Shared.Infrastructure.Auth.JWT;
using SafeZone.Shared.Infrastructure.Security;

namespace SafeZone.Modules.Identity.Core.Commands.Login;

internal class LoginCommandHandler(ITokenStorage _tokenStorage, IUserRepository _userRepository, IPasswordManager _passwordManager, IJsonWebTokenManager _jsonWebTokenManager) : ICommandHandler<LoginCommand, UserDetailsDto>
{
    private readonly IUserRepository userRepository = _userRepository;
    private readonly IPasswordManager passwordManager = _passwordManager;
    private readonly IJsonWebTokenManager jsonWebTokenManager = _jsonWebTokenManager;
    private readonly ITokenStorage tokenStorage = _tokenStorage;

    public async Task<UserDetailsDto> HandleAsync(LoginCommand command, CancellationToken cancellationToken = default)
    {
        var user = await userRepository.GetByEmailAsync(command.Email.ToLowerInvariant(), cancellationToken);

        if(!passwordManager.IsValid(command.Password, user.Password))
        {
            throw new BadRequestException("Login failed, please try again with valid credentials.");
        }

        var token = jsonWebTokenManager.CreateToken(user.Id.ToString(), user.Email, user.Role.ToString());
        tokenStorage.Set(token);

        return UserMapper.FromEntity(user);
    }
}