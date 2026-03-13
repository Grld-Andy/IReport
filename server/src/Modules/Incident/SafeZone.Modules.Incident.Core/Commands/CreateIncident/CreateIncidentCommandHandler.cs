

namespace SafeZone.Modules.Incident.Core.Commands.CreateIncident;

internal sealed class CreateIncidentHandler
    (IIncidentRepository _repository, IMessageBroker _messageBroker,
    IUserApiClient _userApiClient, IContext _context)
    : ICommandHandler<CreateIncidentCommand, Guid>
{
    private readonly IIncidentRepository repository = _repository;
    private readonly IMessageBroker messageBroker = _messageBroker;
    private readonly IUserApiClient userApiClient = _userApiClient;
    private readonly IContext context = _context;

    public async Task<Guid> HandleAsync(CreateIncidentCommand command, CancellationToken cancellationToken = default)
    {

        var location = new IncidentLocation(
            command.Longitude,
            command.Latitude,
            command.LocationDetails);
        var users = await userApiClient.GetUsersByIds([command.ReporterId]);
        var usersDict = users.ToDictionary(u => u.Id);
        var team = usersDict[context.Identity.Id].Team;

        var incident = IncidentEntity.Report(
            command.Subject,
            command.Description,
            command.Category,
            command.Severity,
            command.ReporterId,
            location,
            team
        );

        await repository.AddAsync(incident, cancellationToken);
        await repository.SaveAsync(cancellationToken);

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