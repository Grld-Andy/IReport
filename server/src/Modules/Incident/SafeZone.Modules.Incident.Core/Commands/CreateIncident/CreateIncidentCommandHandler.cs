namespace SafeZone.Modules.Incident.Core.Commands.CreateIncident;

internal sealed class CreateIncidentHandler
    (IIncidentRepository _repository, IncidentDbContext _context)
    : ICommandHandler<CreateIncidentCommand, Guid>
{
    private readonly IIncidentRepository repository = _repository;
    private readonly IncidentDbContext context = _context;

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
            command.ReporterId,
            location);

        await repository.AddAsync(incident, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);

        return incident.Id;
    }
}