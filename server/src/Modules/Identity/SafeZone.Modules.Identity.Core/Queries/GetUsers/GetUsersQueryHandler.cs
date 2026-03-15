namespace SafeZone.Modules.Identity.Core.Queries.GetUsers;

internal class GetUsersQueryHandler(IUserRepository _userRepository) : IQueryHandler<GetUsersQuery, Paged<UserDetailsDto>>
{
    private readonly IUserRepository userRepository = _userRepository;

    public async Task<Paged<UserDetailsDto>> HandleAsync(GetUsersQuery query, CancellationToken cancellationToken = default)
    {
        // Optional: create a dictionary for filters if you prefer
        var filters = new Dictionary<string, string>();
        if (!string.IsNullOrWhiteSpace(query.Filter))
            filters.Add("filter", query.Filter);

        if (!string.IsNullOrWhiteSpace(query.Role))
            filters.Add("role", query.Role);

        if (!string.IsNullOrWhiteSpace(query.Status))
            filters.Add("status", query.Status);

        var result = await userRepository.GetAllAsync(query, filters, cancellationToken);
        return result;
    }
}