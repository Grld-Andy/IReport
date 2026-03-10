using SafeZone.Modules.Incident.Core.Events;
using SafeZone.Shared.Abstractions.Messaging;

namespace SafeZone.Modules.Incident.Core.Commands.DeleteIncident;

internal class DeleteIncidentHandler
    (IIncidentRepository _repository, IncidentDbContext _context, IMessageBroker _messageBroker)
    : ICommandHandler<DeleteIncidentCommand>
{
    private readonly IIncidentRepository repository = _repository;
    private readonly IncidentDbContext context = _context;
    private readonly IMessageBroker messageBroker = _messageBroker;

    public async Task HandleAsync(
        DeleteIncidentCommand command,
        CancellationToken cancellationToken = default)
    {
        var incident = await repository
            .GetByIdAsync(command.IncidentId, cancellationToken)
            ?? throw new NotFoundException("Incident", command.IncidentId);
        
        incident.Delete();
        await messageBroker.PublishAsync(new IncidentDeletedEvent(incident.Id), cancellationToken);

        await context.SaveChangesAsync(cancellationToken);
    }
}