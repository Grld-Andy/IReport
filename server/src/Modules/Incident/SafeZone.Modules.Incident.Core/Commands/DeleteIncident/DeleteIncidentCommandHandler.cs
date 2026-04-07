using System.Security.Claims;

namespace SafeZone.Modules.Incident.Core.Commands.DeleteIncident;

internal class DeleteIncidentHandler
    (IIncidentRepository _repository,
     IncidentDbContext _context,
     IMessageBroker _messageBroker,
     IContext _userContext)
    : ICommandHandler<DeleteIncidentCommand>
{
    private readonly IIncidentRepository repository = _repository;
    private readonly IncidentDbContext context = _context;
    private readonly IMessageBroker messageBroker = _messageBroker;
    private readonly IContext userContext = _userContext;

    public async Task HandleAsync(
        DeleteIncidentCommand command,
        CancellationToken cancellationToken = default)
    {
        var incident = await repository
            .GetByIdAsync(command.IncidentId, cancellationToken)
            ?? throw new NotFoundException("Incident", command.IncidentId);

        var details = string.Join("\n", new[]
        {
            $"Subject: {incident.Subject}",
            $"Severity: {incident.Severity}",
            $"Category: {incident.Category}"
        });

        var actor = userContext.Identity.Claims[ClaimTypes.Name].First();

        _ = messageBroker.PublishAsync(
            new IncidentDeletedEvent(incident.Id), cancellationToken);

        _ =  messageBroker.PublishAsync(
            new ActivityCreatedEvent(
                incident.ReporterId,
                actor,
                "deleted incident",
                details,
                "Incident",
                incident.Reporter.CompanyId
            ), cancellationToken);

        await repository.DeleteAsync(incident.Id, cancellationToken);
    }
}