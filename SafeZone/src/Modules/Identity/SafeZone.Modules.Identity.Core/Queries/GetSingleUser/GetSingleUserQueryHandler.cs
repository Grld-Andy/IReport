namespace SafeZone.Modules.Identity.Core.Queries.GetSingleUser;

internal class GetSingleUserQueryHandler(IUserRepository _userRepository) : IQueryHandler<GetSingleUserQuery, User>
{
    private readonly IUserRepository userRepository = _userRepository;
    public async Task<User> HandleAsync(GetSingleUserQuery query, CancellationToken cancellationToken = default)
    {
        var user = await userRepository.GetAsync(query.Id, cancellationToken);
        return user;
    }
}