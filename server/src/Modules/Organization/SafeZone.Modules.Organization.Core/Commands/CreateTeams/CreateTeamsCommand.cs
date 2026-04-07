using SafeZone.Modules.Organization.Core.DTO;

namespace SafeZone.Modules.Organization.Core.Commands.CreateTeams;

internal record CreateTeamsCommand(List<CreateTeamDto> Teams) : ICommand;