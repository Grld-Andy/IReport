using System.Linq.Expressions;

namespace SafeZone.Modules.Incident.Core.DAL;

internal static class IncidentQueries
{
    public static Expression<Func<IncidentEntity, IncidentDto>> ToDto()
        => i => new IncidentDto
        {
            Id = i.Id,
            Subject = i.Subject.Value,
            Description = i.Description.Value,
            Category = i.Category.ToString(),
            Severity = i.Severity.ToString(),
            Status = i.Status.ToString(),
            Reporter = new IncidentUserDto
            {
                Id = i.Reporter.Id,
                Name = i.Reporter.Name,
                Email = i.Reporter.Email,
                Role = i.Reporter.Role
            },
            AssignedTo = i.AssignedTo == null ? null : new IncidentUserDto
            {
                Id = i.AssignedTo.Id,
                Name = i.AssignedTo.Name,
                Email = i.AssignedTo.Email,
                Role = i.AssignedTo.Role
            },
            Team = i.Team,
            Latitude = i.Location.Latitude,
            Longitude = i.Location.Longitude,
            LocationDetails = i.Location.ExtraDetails,
            CreatedAt = i.CreatedAt,
            UpdatedAt = i.UpdatedAt
        };

    public static IQueryable<IncidentDto> ApplyFilters(
        this IQueryable<IncidentDto> query,
        Dictionary<string,string>? filters,
        IContext context)
    {
        if (filters is null || filters.Count == 0)
            return query;

        var role = context.Identity.Role;
        var id = context.Identity.Id;

        if (filters.TryGetValue("team", out var team) &&
            !role.Equals("admin", StringComparison.InvariantCultureIgnoreCase))
        {
            if (role.Equals("supervisor"))
            {
                query = query.Where(i =>
                    EF.Functions.Like(i.Team.ToLower(), $"%{team.ToLower()}%"));
            }
            else
            {
                query = query.Where(i =>
                    i.ReporterId == id || i.AssignedToId == id);
            }
        }

        if (filters.TryGetValue("filter", out var filter))
        {
            query = query.Where(i =>
                EF.Functions.Like(i.Subject, $"%{filter}%") ||
                EF.Functions.Like(i.Description, $"%{filter}%"));
        }

        if (filters.TryGetValue("userId", out var userId))
        {
            var parsed = Guid.Parse(userId);
            query = query.Where(x => x.AssignedToId == parsed);
        }

        if (filters.TryGetValue("status", out var status))
        {
            var incidentStatus = status.ToLower() switch
            {
                "open" => IncidentStatus.Open,
                "inprogress" => IncidentStatus.InProgress,
                "closed" => IncidentStatus.Closed,
                "resolved" => IncidentStatus.Resolved,
                _ => IncidentStatus.Open
            };

            query = query.Where(x => x.Status != incidentStatus.ToString());
        }

        return query;
    }

    public static IQueryable<IncidentDto> ApplySorting(
        this IQueryable<IncidentDto> query,
        string orderBy,
        string sortOrder)
    {
        return (orderBy, sortOrder) switch
        {
            ("createdat","asc") => query.OrderBy(x => x.CreatedAt),
            ("-createdat","desc") => query.OrderByDescending(x => x.CreatedAt),
            ("severity","asc") => query.OrderBy(x => x.Severity),
            ("-severity","desc") => query.OrderByDescending(x => x.Severity),
            ("category","asc") => query.OrderBy(x => x.Category),
            ("-category","desc") => query.OrderByDescending(x => x.Category),
            _ => query.OrderByDescending(x => x.CreatedAt)
        };
    }
}