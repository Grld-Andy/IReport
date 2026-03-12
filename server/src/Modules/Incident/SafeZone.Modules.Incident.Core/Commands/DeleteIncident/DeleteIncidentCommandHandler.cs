using SafeZone.Modules.Incident.Core.Events;
using SafeZone.Shared.Abstractions.Contexts;
using SafeZone.Shared.Abstractions.Messaging;

namespace SafeZone.Modules.Incident.Core.Commands.DeleteIncident;

internal class DeleteIncidentHandler
    (IIncidentRepository _repository,
     IncidentDbContext _context,
     IMessageBroker _messageBroker,
     IContext _userContext,
     IUserApiClient _userApiClient)
    : ICommandHandler<DeleteIncidentCommand>
{
    private readonly IIncidentRepository repository = _repository;
    private readonly IncidentDbContext context = _context;
    private readonly IMessageBroker messageBroker = _messageBroker;
    private readonly IContext userContext = _userContext;
    private readonly IUserApiClient userApiClient = _userApiClient;

    public async Task HandleAsync(
        DeleteIncidentCommand command,
        CancellationToken cancellationToken = default)
    {
        var incident = await repository
            .GetByIdAsync(command.IncidentId, cancellationToken)
            ?? throw new NotFoundException("Incident", command.IncidentId);

        var details = string.Join("\n", new[]
        {
            $"Subject: {incident.Subject.Value}",
            $"Severity: {incident.Severity}",
            $"Category: {incident.Category}"
        });

        var users = await userApiClient.GetUsersByIds(
            [userContext.Identity.Id]);

        var actor = users.First();

        incident.Delete();

        await messageBroker.PublishAsync(
            new IncidentDeletedEvent(incident.Id), cancellationToken);

        await messageBroker.PublishAsync(
            new ActivityCreatedEvent(
                incident.ReporterId,
                actor.Name,
                "deleted incident",
                details,
                "Incident"
            ), cancellationToken);

        await context.SaveChangesAsync(cancellationToken);
    }
}