namespace SafeZone.Modules.Identity.Core.Queries.GetUsersByIds;

internal record GetUsersByIdsQuery(List<Guid> Ids) : IQuery<List<UserDetailsDto>>;