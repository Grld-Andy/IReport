namespace SafeZone.Modules.Incident.Core.Commands.ChangeIncidentStatus;

internal sealed class ChangeIncidentStatusHandler(
    IIncidentRepository _repository, IncidentDbContext _context)
    : ICommandHandler<ChangeIncidentStatusCommand>
{
    private readonly IIncidentRepository repository = _repository;
    private readonly IncidentDbContext context = _context;

    public async Task HandleAsync(ChangeIncidentStatusCommand command, CancellationToken cancellationToken = default)
    {
        var incident = await repository.GetByIdAsync(command.IncidentId, cancellationToken) ?? throw new NotFoundException("Incident not found");

        switch (command.Status)
        {
            case IncidentStatus.Resolved:
                incident.Resolve();
                break;

            case IncidentStatus.Closed:
                incident.Close();
                break;

            case IncidentStatus.InProgress:
                throw new BadRequestException("Use Assign endpoint to move to InProgress");

            default:
                throw new BadRequestException("Invalid status transition");
        }

        await context.SaveChangesAsync(cancellationToken);
    }
}