namespace SafeZone.Modules.Identity.Core.Queries.GetUsersByIds;

internal class GetUsersByIdsQueryHandler(IUserRepository _userRepository) : IQueryHandler<GetUsersByIdsQuery, List<UserDetailsDto>>
{
    private readonly IUserRepository userRepository = _userRepository;
    public async Task<List<UserDetailsDto>> HandleAsync(GetUsersByIdsQuery query, CancellationToken cancellationToken = default)
    {
        var users = await userRepository.GetAllByIdsAsync(query.Guids, cancellationToken);
        return users;
    }
}