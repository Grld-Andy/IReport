namespace SafeZone.Modules.Identity.Core.Commands.Register;

internal record RegisterCommand(User User) : ICommand;