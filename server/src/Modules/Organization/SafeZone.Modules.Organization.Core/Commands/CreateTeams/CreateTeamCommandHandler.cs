using SafeZone.Shared.Abstractions.Contexts;

namespace SafeZone.Modules.Organization.Core.Commands.CreateTeams;

internal class CreateTeamsCommandHandler(ITeamRepository _teamRepository, IContext _context) : ICommandHandler<CreateTeamsCommand>
{
    private readonly ITeamRepository teamRepository = _teamRepository;
    private readonly IContext context = _context;

    async Task ICommandHandler<CreateTeamsCommand>.HandleAsync(CreateTeamsCommand command, CancellationToken cancellationToken)
    {
        Guid companyId = Guid.Parse(context.Identity.Claims["CompanyId"].First());
        var teams = new List<Team>();
        foreach (var team in command.Teams)
        {
            teams.Add(Team.AddTeam(team.Name, companyId));
        }
        await teamRepository.AddListAsync(teams, cancellationToken);
    }
}