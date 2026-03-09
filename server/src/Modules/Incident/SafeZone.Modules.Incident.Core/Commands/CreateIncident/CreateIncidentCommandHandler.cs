using SafeZone.Modules.Incident.Core.Events;
using SafeZone.Shared.Abstractions.Messaging;
using SafeZone.Shared.Abstractions.Modules;

namespace SafeZone.Modules.Incident.Core.Commands.CreateIncident;

internal sealed class CreateIncidentHandler
    (IIncidentRepository _repository, IMessageBroker _messageBroker)
    : ICommandHandler<CreateIncidentCommand, Guid>
{
    private readonly IIncidentRepository repository = _repository;
    private readonly IMessageBroker messageBroker = _messageBroker;

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

        await messageBroker.PublishAsync(new IncidentAddedEvent(incident.Id, incident.Subject, incident.Status.ToString()), cancellationToken);
        return incident.Id;
    }
}