namespace SafeZone.Modules.Identity.Core.Queries.GetUsersByIds;

internal record GetUsersByIdsQuery(List<Guid> Guids) : IQuery<List<UserDetailsDto>>;