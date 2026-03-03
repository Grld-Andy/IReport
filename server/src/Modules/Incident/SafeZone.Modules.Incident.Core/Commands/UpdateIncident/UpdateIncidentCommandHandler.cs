using Microsoft.AspNetCore.Http.HttpResults;

namespace SafeZone.Modules.Incident.Core.Commands.UpdateIncident;

internal sealed class UpdateIncidentHandler
    (IIncidentRepository _repository, IncidentDbContext _context)
    : ICommandHandler<UpdateIncidentCommand>
{
    private readonly IIncidentRepository repository = _repository;
    private readonly IncidentDbContext context = _context;

    public async Task HandleAsync(
        UpdateIncidentCommand command,
        CancellationToken cancellationToken = default)
    {
        var incident = await repository.GetByIdAsync(
            command.IncidentId, cancellationToken) ?? throw new NotFoundException("Incident", command.IncidentId);
        incident.ChangeSeverity(command.Severity);

        await context.SaveChangesAsync(cancellationToken);
    }
}