namespace SafeZone.Modules.Incident.Core.Commands.UpdateIncident;

internal sealed class UpdateIncidentHandler
    (IIncidentRepository _repository, IMessageBroker _messageBroker, IContext _context, IUserApiClient _userApiClient)
    : ICommandHandler<UpdateIncidentCommand>
{
    private readonly IIncidentRepository repository = _repository;
    private readonly IMessageBroker messageBroker = _messageBroker;
    private readonly IUserApiClient userApiClient = _userApiClient;
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

        List<Guid> userIds = [incident.ReporterId, context.Identity.Id];

        if (command.AssignedToId.HasValue)
        {
            userIds.Add(command.AssignedToId.Value);
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
        var users = await userApiClient.GetUsersByIds(userIds);
        var usersDict = users.ToDictionary(u => u.Id);

        if (incident.AssignedToId != command.AssignedToId && command.AssignedToId.HasValue)
            changes.Add($"Reassigned to {usersDict[command.AssignedToId.Value]}");

        var changesString = string.Join("\n", changes);

        await messageBroker.PublishAsync(
            new IncidentUpdatedEvent(
                IncidentMapper.FromEntity(incident, usersDict)), cancellationToken);

        await messageBroker.PublishAsync(
            new ActivityCreatedEvent(
                incident.ReporterId,
                usersDict[context.Identity.Id].Name,
                "updated incident",
                changesString,
                "Incident"
            ), cancellationToken);

        await repository.SaveAsync(cancellationToken);
    }
}