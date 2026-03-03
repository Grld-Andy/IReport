namespace SafeZone.Modules.Incident.Core.Commands.DeleteIncident;

internal class DeleteIncidentHandler
    (IIncidentRepository _repository, IncidentDbContext _context)
    : ICommandHandler<DeleteIncidentCommand>
{
    private readonly IIncidentRepository repository = _repository;
    private readonly IncidentDbContext context = _context;

    public async Task HandleAsync(
        DeleteIncidentCommand command,
        CancellationToken cancellationToken = default)
    {
        var incident = await repository
            .GetByIdAsync(command.IncidentId, cancellationToken)
            ?? throw new NotFoundException("Incident", command.IncidentId);
        
        incident.Delete();

        await context.SaveChangesAsync(cancellationToken);
    }
}