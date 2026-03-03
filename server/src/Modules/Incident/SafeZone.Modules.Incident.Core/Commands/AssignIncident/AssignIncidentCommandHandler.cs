namespace SafeZone.Modules.Incident.Core.Commands.AssignIncident;

internal class AssignIncidentCommandHandler
    ( IIncidentRepository _repository, IncidentDbContext _context)
    : ICommandHandler<AssignIncidentCommand>
{
    private readonly IIncidentRepository repository = _repository;
    private readonly IncidentDbContext context = _context;

    public async Task HandleAsync(AssignIncidentCommand command, CancellationToken cancellationToken = default)
    {
        var incident = await repository.GetByIdAsync(command.IncidentId, cancellationToken) ?? throw new NotFoundException("Incident", command.IncidentId);
        incident.AssignTo(command.UserId);

        await context.SaveChangesAsync(cancellationToken);
    }
}