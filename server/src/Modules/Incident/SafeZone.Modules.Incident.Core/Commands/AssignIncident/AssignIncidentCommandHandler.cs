using SafeZone.Modules.Incident.Core.Events;
using SafeZone.Shared.Abstractions.Contexts;
using SafeZone.Shared.Abstractions.Messaging;

namespace SafeZone.Modules.Incident.Core.Commands.AssignIncident;

internal class AssignIncidentCommandHandler
    (IIncidentRepository _repository,
     IMessageBroker _messageBroker,
     IContext _userContext,
     IUserApiClient _userApiClient)
    : ICommandHandler<AssignIncidentCommand>
{
    private readonly IIncidentRepository repository = _repository;
    private readonly IMessageBroker messageBroker = _messageBroker;
    private readonly IContext userContext = _userContext;
    private readonly IUserApiClient userApiClient = _userApiClient;

    public async Task HandleAsync(AssignIncidentCommand command, CancellationToken cancellationToken = default)
    {
        var incident = await repository.GetByIdAsync(command.IncidentId, cancellationToken) 
            ?? throw new NotFoundException("Incident", command.IncidentId);

        // store previous assigned user (optional)
        var oldAssignedId = incident.AssignedToId;

        // assign new user
        incident.AssignTo(command.UserId);

        await repository.SaveAsync(cancellationToken);

        // get user info for activity feed
        var users = await userApiClient.GetUsersByIds([command.UserId, userContext.Identity.Id]);
        var usersDict = users.ToDictionary(u => u.Id);
        var actor = users.First(u => u.Id == userContext.Identity.Id);
        var assignedUser = users.First(u => u.Id == command.UserId);

        // prepare activity message
        string details = oldAssignedId.HasValue
            ? $"Assigned changed from {oldAssignedId} → {command.UserId} ({assignedUser.Name})"
            : $"Assigned to {assignedUser.Name}";

        await messageBroker.PublishAsync(
            new ActivityCreatedEvent(
                incident.ReporterId,
                actor.Name,
                "assigned incident",
                details,
                "Incident"
            ), cancellationToken);

        await messageBroker.PublishAsync(
            new IncidentUpdatedEvent(IncidentMapper.FromEntity(incident, usersDict)), cancellationToken);
    }
}