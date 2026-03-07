namespace SafeZone.Modules.Identity.Core.Commands.Login;

internal record LoginCommand(string Email, string Password) : ICommand<UserDetailsDto>;