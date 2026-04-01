namespace SafeZone.Modules.Organization.Core.Commands.CreateTeams;

internal class CreateTeamsCommandHandler(ITeamRepository _teamRepository) : ICommandHandler<CreateTeamsCommand>
{
    private readonly ITeamRepository teamRepository = _teamRepository;

    async Task ICommandHandler<CreateTeamsCommand>.HandleAsync(CreateTeamsCommand command, CancellationToken cancellationToken)
    {

        var teams = new List<Team>();
        foreach (var team in teams)
        {
            teams.Add(Team.AddTeam(team.Name, team.CompanyId));
        }
        await teamRepository.AddListAsync(teams, cancellationToken);
    }
}