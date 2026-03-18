using System.Security.Claims;

namespace SafeZone.Modules.Incident.Core.Commands.AssignIncident;

internal class AssignIncidentCommandHandler
    (IIncidentRepository _incidentRepository,
     IUserRepository _userRepository,
     IMessageBroker _messageBroker,
     IContext _userContext)
    : ICommandHandler<AssignIncidentCommand>
{
    private readonly IUserRepository userRepository = _userRepository;
    private readonly IIncidentRepository incidentRepository = _incidentRepository;
    private readonly IMessageBroker messageBroker = _messageBroker;
    private readonly IContext userContext = _userContext;

    public async Task HandleAsync(AssignIncidentCommand command, CancellationToken cancellationToken = default)
    {
        var incident = await incidentRepository.GetByIdAsync(command.IncidentId, cancellationToken) 
            ?? throw new NotFoundException("Incident", command.IncidentId);

        var oldAssignedId = incident.AssignedToId;
        incident.AssignTo(command.UserId);

        await incidentRepository.SaveAsync(cancellationToken);

        var actorName = userContext.Identity.Claims[ClaimTypes.Name].First();
        var assignedUser = await userRepository.GetByIdAsync(command.UserId, cancellationToken);

        string details = oldAssignedId.HasValue
            ? $"Assigned changed from {oldAssignedId} → {command.UserId} ({assignedUser.Name})"
            : $"Assigned to {assignedUser.Name}";

        _ = messageBroker.PublishAsync(
            new ActivityCreatedEvent(
                incident.ReporterId,
                actorName,
                "assigned incident",
                details,
                "Incident"
            ), cancellationToken);

        var incidentDto = IncidentMapper.FromEntity(incident);
        incidentDto.AssignedTo = assignedUser;
        
        _ = messageBroker.PublishAsync(
            new IncidentUpdatedEvent(incidentDto), cancellationToken);
    }
}