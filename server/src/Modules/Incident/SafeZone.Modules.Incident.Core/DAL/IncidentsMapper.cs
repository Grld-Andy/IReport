using SafeZone.Modules.Incident.Core.Clients.DTO;
namespace SafeZone.Modules.Incident.Core.DAL;

internal static class IncidentMapper
{
    public static IncidentDto FromEntity(IncidentEntity incident, IReadOnlyDictionary<Guid, UserDto> usersById)
    {
        if (!usersById.TryGetValue(incident.ReporterId, out var reporter))
        {
            throw new NotFoundException($"Reporter with ID {incident.ReporterId} not found in provided users dictionary.");
        }

        UserDto? assigned = null;
        if (incident.AssignedToId.HasValue)
        {
            usersById.TryGetValue(incident.AssignedToId.Value, out assigned);
        }

        return new IncidentDto
        {
            Id = incident.Id,
            Subject = incident.Subject.Value,
            Description = incident.Description.Value,
            Category = incident.Category.ToString(),
            Severity = incident.Severity.ToString(),
            Status = incident.Status.ToString(),
            Reporter = reporter,
            AssignedTo = assigned,
            Latitude = incident.Location.Latitude,
            Longitude = incident.Location.Longitude,
            LocationDetails = incident.Location.ExtraDetails,
            CreatedAt = incident.CreatedAt,
            UpdatedAt = incident.UpdatedAt
        };
    }
}