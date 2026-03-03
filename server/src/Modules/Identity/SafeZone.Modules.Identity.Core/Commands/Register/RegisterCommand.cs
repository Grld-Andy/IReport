namespace SafeZone.Modules.Identity.Core.Commands.Register;

internal record RegisterCommand(UserCreateDto User) : ICommand;