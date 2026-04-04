namespace SafeZone.Modules.Organization.Core.Commands.CreateTeam;

internal class CreateTeamCommandHandler(ITeamRepository _teamRepository) : ICommandHandler<CreateTeamCommand>
{
    private readonly ITeamRepository teamRepository = _teamRepository;

    async Task ICommandHandler<CreateTeamCommand>.HandleAsync(CreateTeamCommand command, CancellationToken cancellationToken)
    {
        var team = Team.AddTeam(command.Name, command.CompanyId);
        await teamRepository.AddAsync(team, cancellationToken);
    }
}