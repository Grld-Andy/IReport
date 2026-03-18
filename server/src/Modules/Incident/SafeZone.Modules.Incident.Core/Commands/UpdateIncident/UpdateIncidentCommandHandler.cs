namespace SafeZone.Modules.Incident.Core.Commands.UpdateIncident;

internal sealed class UpdateIncidentHandler
    (IIncidentRepository _repository, IMessageBroker _messageBroker, IContext _context, IUserRepository _userRepository)
    : ICommandHandler<UpdateIncidentCommand>
{
    private readonly IIncidentRepository repository = _repository;
    private readonly IUserRepository userRepository = _userRepository;
    private readonly IMessageBroker messageBroker = _messageBroker;
    private readonly IContext context = _context;

    public async Task HandleAsync(
        UpdateIncidentCommand command,
        CancellationToken cancellationToken = default)
    {
        var incident = await repository.GetByIdAsync(
            command.IncidentId, cancellationToken) 
            ?? throw new NotFoundException("Incident", command.IncidentId);

        var changes = new List<string>();

        if (incident.Subject.Value != command.Subject)
            changes.Add($"Subject: {incident.Subject.Value} → {command.Subject}");

        if (incident.Description.Value != command.Description)
            changes.Add($"Description updated");

        if (incident.Severity != command.Severity)
            changes.Add($"Severity: {incident.Severity} → {command.Severity}");

        if (incident.Category != command.Category)
            changes.Add($"Category: {incident.Category} → {command.Category}");

        if (command.AssignedToId.HasValue)
        {
            incident.AssignTo(command.AssignedToId.Value);
        }
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

        if (incident.Status != command.Status)
            changes.Add($"Status: {command.Status} → {incident.Status}");

        incident.UpdateIncident(command);

        if (incident.AssignedToId != command.AssignedToId && command.AssignedToId.HasValue)
            changes.Add($"Reassigned to {incident.AssignedTo?.Name ?? "Guest"}");

        var changesString = string.Join("\n", changes);

        await repository.SaveAsync(cancellationToken);

        var incidentDto = IncidentMapper.FromEntity(incident);

        if(command.AssignedToId.HasValue){
            var assignedUser = await userRepository.GetByIdAsync(command.AssignedToId.Value, cancellationToken);
            incidentDto.AssignedTo = assignedUser;
        }
        Console.WriteLine($"======================= assigned to : {incidentDto.AssignedTo?.Name}");

        _ = messageBroker.PublishAsync(
            new IncidentUpdatedEvent(incidentDto), cancellationToken);

        _ = messageBroker.PublishAsync(
            new ActivityCreatedEvent(
                incident.ReporterId,
                context.Identity.Claims["Name"].First(),
                "updated incident",
                changesString,
                "Incident"
            ), cancellationToken);
    }
}