using SafeZone.Modules.Incident.Core.Events;
using SafeZone.Shared.Abstractions.Messaging;

namespace SafeZone.Modules.Incident.Core.Commands.UpdateIncident;

internal sealed class UpdateIncidentHandler
    (IIncidentRepository _repository, IMessageBroker _messageBroker, IUserApiClient _userApiClient)
    : ICommandHandler<UpdateIncidentCommand>
{
    private readonly IIncidentRepository repository = _repository;
    private readonly IMessageBroker messageBroker = _messageBroker;
    private readonly IUserApiClient userApiClient = _userApiClient;

    public async Task HandleAsync(
        UpdateIncidentCommand command,
        CancellationToken cancellationToken = default)
    {
        var incident = await repository.GetByIdAsync(
            command.IncidentId, cancellationToken) ?? throw new NotFoundException("Incident", command.IncidentId);
        incident.UpdateIncident(command);

        var users = await userApiClient.GetUsersByIds([incident.ReporterId]);
        var usersDict = users.ToDictionary(u => u.Id);

        await messageBroker.PublishAsync(new IncidentUpdatedEvent(IncidentMapper.FromEntity(incident, usersDict)), cancellationToken);
        await repository.SaveAsync(cancellationToken);
    }
}