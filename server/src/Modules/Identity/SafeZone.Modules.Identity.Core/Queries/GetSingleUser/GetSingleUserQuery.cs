namespace SafeZone.Modules.Identity.Core.Queries.GetSingleUser;

internal record GetSingleUserQuery(Guid Id) : IQuery<User>;