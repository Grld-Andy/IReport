namespace SafeZone.Modules.Incident.Core.Commands.CreateIncident;

internal sealed class CreateIncidentHandler
    (IIncidentRepository _incidentRepository, IMessageBroker _messageBroker, IContext _context)
    : ICommandHandler<CreateIncidentCommand, Guid>
{
    private readonly IIncidentRepository incidentRepository = _incidentRepository;
    private readonly IMessageBroker messageBroker = _messageBroker;
    private readonly IContext context = _context;

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
            context.Identity.Id,
            location,
            context.Identity.Claims["Team"].First()
        );

        await incidentRepository.AddAsync(incident, cancellationToken);
        await incidentRepository.SaveAsync(cancellationToken);

        incident = await incidentRepository.GetByIdAsync(incident.Id, cancellationToken);
        
        _ = messageBroker.PublishAsync(new IncidentAddedEvent(IncidentMapper.FromEntity(incident)), cancellationToken);
        _ = messageBroker.PublishAsync(new ActivityCreatedEvent(
            incident.ReporterId,
            incident.Reporter.Name,
            "reported incident",
            $"Incident: {incident.Subject.Value}",
            "Incident"
        ), cancellationToken);

        return incident.Id;
    }
}