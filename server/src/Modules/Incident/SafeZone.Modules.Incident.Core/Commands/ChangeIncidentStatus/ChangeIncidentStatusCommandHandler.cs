using SafeZone.Modules.Incident.Core.Events;
using SafeZone.Shared.Abstractions.Contexts;
using SafeZone.Shared.Abstractions.Messaging;

namespace SafeZone.Modules.Incident.Core.Commands.ChangeIncidentStatus;

internal sealed class ChangeIncidentStatusHandler(
    IIncidentRepository _repository,
    IncidentDbContext _context,
    IMessageBroker _messageBroker,
    IUserApiClient _userApiClient,
    IContext _userContext)
    : ICommandHandler<ChangeIncidentStatusCommand>
{
    private readonly IIncidentRepository repository = _repository;
    private readonly IMessageBroker messageBroker = _messageBroker;
    private readonly IUserApiClient userApiClient = _userApiClient;
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

        List<Guid> userIds = [incident.ReporterId];
        if (incident.AssignedToId.HasValue)
            userIds.Add(incident.AssignedToId.Value);

        var users = await userApiClient.GetUsersByIds(userIds);
        var usersDict = users.ToDictionary(u => u.Id);

        await messageBroker.PublishAsync(
            new IncidentUpdatedEvent(
                IncidentMapper.FromEntity(incident, usersDict)),
            cancellationToken);

        var actor = users.First(u => u.Id == userContext.Identity.Id);

        string details = $"Status changed: {oldStatus} → {incident.Status}";
        await messageBroker.PublishAsync(
            new ActivityCreatedEvent(
                incident.ReporterId,
                actor.Name,
                "changed incident status",
                details,
                "Incident"),
            cancellationToken);

        await context.SaveChangesAsync(cancellationToken);
    }
}