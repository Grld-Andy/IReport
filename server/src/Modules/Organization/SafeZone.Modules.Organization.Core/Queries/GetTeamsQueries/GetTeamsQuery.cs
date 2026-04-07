using SafeZone.Shared.Abstractions.Queries;

namespace SafeZone.Modules.Organization.Core.Queries.GetTeamsQueries;

internal record GetTeamsQuery() : IQuery<IEnumerable<TeamDto>>;