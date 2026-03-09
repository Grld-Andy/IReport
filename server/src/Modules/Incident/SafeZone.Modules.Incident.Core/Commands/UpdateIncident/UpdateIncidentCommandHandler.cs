namespace SafeZone.Modules.Incident.Core.Commands.UpdateIncident;

internal sealed class UpdateIncidentHandler
    (IIncidentRepository _repository)
    : ICommandHandler<UpdateIncidentCommand>
{
    private readonly IIncidentRepository repository = _repository;

    public async Task HandleAsync(
        UpdateIncidentCommand command,
        CancellationToken cancellationToken = default)
    {
        var incident = await repository.GetByIdAsync(
            command.IncidentId, cancellationToken) ?? throw new NotFoundException("Incident", command.IncidentId);
        incident.UpdateIncident(command);

        await repository.SaveAsync(cancellationToken);
    }
}