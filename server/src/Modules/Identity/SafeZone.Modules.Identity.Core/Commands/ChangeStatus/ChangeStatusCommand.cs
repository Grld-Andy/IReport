namespace SafeZone.Modules.Identity.Core.Commands.ChangeStatus;

internal record ChangeStatusCommand(Guid Id, string Status) : ICommand;