using SafeZone.Shared.Abstractions.Contexts;

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

        if (incident.AssignedToId != command.AssignedToId)
            changes.Add($"AssignedTo changed");

        incident.UpdateIncident(command);

        List<Guid> userIds = [incident.ReporterId, context.Identity.Id];

        if (command.AssignedToId.HasValue)
        {
            userIds.Add(command.AssignedToId.Value);
            incident.AssignTo(command.AssignedToId.Value);
        }

        var users = await userApiClient.GetUsersByIds(userIds);
        var usersDict = users.ToDictionary(u => u.Id);

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