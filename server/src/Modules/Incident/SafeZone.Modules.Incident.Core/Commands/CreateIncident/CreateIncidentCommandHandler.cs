

namespace SafeZone.Modules.Incident.Core.Commands.CreateIncident;

internal sealed class CreateIncidentHandler
    (IIncidentRepository _repository, IMessageBroker _messageBroker,
    IUserApiClient _userApiClient)
    : ICommandHandler<CreateIncidentCommand, Guid>
{
    private readonly IIncidentRepository repository = _repository;
    private readonly IMessageBroker messageBroker = _messageBroker;
    private readonly IUserApiClient userApiClient = _userApiClient;

    public async Task<Guid> HandleAsync(CreateIncidentCommand command, CancellationToken cancellationToken = default)
    {
        var location = new IncidentLocation(
            command.Longitude,
            command.Latitude,
            command.LocationDetails);

        var incident = IncidentEntity.Report(
            command.Subject,
            command.Description,
            command.Category,
            command.Severity,
            command.ReporterId,
            location);

        await repository.AddAsync(incident, cancellationToken);
        await repository.SaveAsync(cancellationToken);

        var users = await userApiClient.GetUsersByIds([incident.ReporterId]);
        var usersDict = users.ToDictionary(u => u.Id);

        await messageBroker.PublishAsync(new IncidentAddedEvent(IncidentMapper.FromEntity(incident, usersDict)), cancellationToken);
        await messageBroker.PublishAsync(new ActivityCreatedEvent(
            incident.ReporterId,
            usersDict[incident.ReporterId].Name,
            "reported incident",
            $"Incident: {incident.Subject.Value}",
            "Incident"
        ), cancellationToken);

        return incident.Id;
    }
}