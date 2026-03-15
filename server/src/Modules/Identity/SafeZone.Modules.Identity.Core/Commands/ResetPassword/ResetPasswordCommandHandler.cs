using SafeZone.Shared.Abstractions.Contexts;
using SafeZone.Shared.Infrastructure.Security;

namespace SafeZone.Modules.Identity.Core.Commands.ResetPassword;

internal class ResetPasswordCommandHandler(
    IUserRepository _userRepository, 
    IContext _context,
    IPasswordManager _passwordManager
) : ICommandHandler<ResetPasswordCommand>
{
    private readonly IUserRepository userRepository = _userRepository;
    private readonly IContext context = _context;
    private readonly IPasswordManager passwordManager = _passwordManager;

    public async Task HandleAsync(ResetPasswordCommand command, CancellationToken cancellationToken = default)
    {
        if (command.Password != command.ConfirmPassword)
        {
            throw new BadRequestException("Passwords do not match, please try again.");
        }

        var userEmail = context.Identity.Claims["email"].First();
        System.Console.WriteLine($"====================== {userEmail}");

        var user = await userRepository.GetByEmailAsync(userEmail, cancellationToken)
            ?? throw new UserNotFoundException(userEmail);

        if (!passwordManager.IsValid(command.CurrentPassword, user.Password))
        {
            throw new BadRequestException("Current password is incorrect.");
        }

        var newPassword = passwordManager.Secure(command.Password);
        user.ResetPassword(newPassword);

        await userRepository.SaveAsync(cancellationToken);
    }
}