namespace SafeZone.Modules.Identity.Core.Queries.GetUsers;

internal class GetUsersQueryHandler(IUserRepository _userRepository) : IQueryHandler<GetUsersQuery, Paged<User>>
{
    private readonly IUserRepository userRepository = _userRepository;

    public async Task<Paged<User>> HandleAsync(GetUsersQuery query, CancellationToken cancellationToken = default)
    {
        var result = await userRepository.GetAllAsync(query, cancellationToken);
        return result;
    }
}