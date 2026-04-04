namespace SafeZone.Modules.Organization.Core.Commands.CreateTeam;

internal record CreateTeamCommand(Guid CompanyId, string Name) : ICommand;