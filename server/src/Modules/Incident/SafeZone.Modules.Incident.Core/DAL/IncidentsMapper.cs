namespace SafeZone.Modules.Incident.Core.DAL;
internal static class IncidentMapper
{
    public static IncidentDto FromEntity(IncidentEntity incident)
    {
        return new IncidentDto
        {
            Id = incident.Id,
            Subject = incident.Subject.Value,
            Description = incident.Description.Value,
            Category = incident.Category,
            Severity = incident.Severity.ToString(),
            Status = incident.Status.ToString(),
            Reporter = new IncidentUserDto
            {
                Id = incident.Reporter.Id,
                Name = incident.Reporter.Name,
                Email = incident.Reporter.Email,
                Role = incident.Reporter.Role,
                CompanyId = incident.Reporter.CompanyId
            },
            AssignedTo = incident.AssignedTo == null ? null : new IncidentUserDto
            {
                Id = incident.AssignedTo.Id,
                Name = incident.AssignedTo.Name,
                Email = incident.AssignedTo.Email,
                Role = incident.AssignedTo.Role,
                CompanyId = incident.AssignedTo.CompanyId,
            },
            Team = incident.Team,
            Latitude = incident.Location.Latitude,
            Longitude = incident.Location.Longitude,
            LocationDetails = incident.Location.ExtraDetails,
            CreatedAt = incident.CreatedAt,
            UpdatedAt = incident.UpdatedAt
        };
    }
}