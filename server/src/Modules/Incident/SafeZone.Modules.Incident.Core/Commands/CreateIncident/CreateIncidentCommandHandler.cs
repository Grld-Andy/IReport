

using System.Security.Claims;

namespace SafeZone.Modules.Incident.Core.Commands.CreateIncident;

internal sealed class CreateIncidentHandler
    (IIncidentRepository _incidentRepository, IMessageBroker _messageBroker,
    IUserRepository _userRepository, IContext _context)
    : ICommandHandler<CreateIncidentCommand, Guid>
{
    private readonly IIncidentRepository incidentRepository = _incidentRepository;
    private readonly IUserRepository userRepository = _userRepository;
    private readonly IMessageBroker messageBroker = _messageBroker;
    private readonly IContext context = _context;

    public async Task<Guid> HandleAsync(CreateIncidentCommand command, CancellationToken cancellationToken = default)
    {
        var user = new CreateIncidentUserDto()
        {
            Name= context.Identity.Claims[ClaimTypes.Name].First(),
            Email= context.Identity.Claims[ClaimTypes.Email].First(),
            Role= context.Identity.Claims[ClaimTypes.Role].First(),
        };

        await userRepository.AddUserAsync(context.Identity.Id, user, cancellationToken);

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
            location,
            context.Identity.Claims["Team"].First()
        );

        await incidentRepository.AddAsync(incident, cancellationToken);
        await incidentRepository.SaveAsync(cancellationToken);

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