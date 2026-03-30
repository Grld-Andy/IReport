using System.Security.Claims;

namespace SafeZone.Modules.Incident.Core.Commands.ChangeIncidentStatus;

internal sealed class ChangeIncidentStatusHandler(
    IIncidentRepository _repository,
    IncidentDbContext _context,
    IMessageBroker _messageBroker,
    IContext _userContext)
    : ICommandHandler<ChangeIncidentStatusCommand>
{
    private readonly IIncidentRepository repository = _repository;
    private readonly IMessageBroker messageBroker = _messageBroker;
    private readonly IncidentDbContext context = _context;
    private readonly IContext userContext = _userContext;

    public async Task HandleAsync(ChangeIncidentStatusCommand command, CancellationToken cancellationToken = default)
    {
        var incident = await repository.GetByIdAsync(command.IncidentId, cancellationToken) 
            ?? throw new NotFoundException("Incident not found");

        var oldStatus = incident.Status;

        switch (command.Status)
        {
            case IncidentStatus.Resolved:
                incident.Resolve();
                break;

            case IncidentStatus.Open:
                incident.Open();
                break;

            case IncidentStatus.Closed:
                incident.Close();
                break;

            case IncidentStatus.InProgress:
                incident.InProgress();
                break;

            default:
                throw new BadRequestException("Invalid status transition");
        }

        var incidentDto = IncidentMapper.FromEntity(incident);


        var actorName = userContext.Identity.Claims["Name"].First();

        _ = messageBroker.PublishAsync(new IncidentUpdatedEvent(incidentDto), cancellationToken);
        string details = $"Status changed: {oldStatus} → {incident.Status}";
        _ = messageBroker.PublishAsync(
            new ActivityCreatedEvent(
                incidentDto.ReporterId,
                actorName ?? "Guest",
                "changed incident status",
                details,
                "Incident"),
            cancellationToken);

        await context.SaveChangesAsync(cancellationToken);
    }
}