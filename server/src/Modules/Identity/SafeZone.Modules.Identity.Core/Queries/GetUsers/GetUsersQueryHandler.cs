using SafeZone.Modules.Identity.Core.DTO;

namespace SafeZone.Modules.Identity.Core.Queries.GetUsers;

internal class GetUsersQueryHandler(IUserRepository _userRepository) : IQueryHandler<GetUsersQuery, Paged<UserDetailsDto>>
{
    private readonly IUserRepository userRepository = _userRepository;

    public async Task<Paged<UserDetailsDto>> HandleAsync(GetUsersQuery query, CancellationToken cancellationToken = default)
    {
        var result = await userRepository.GetAllAsync(query, cancellationToken);
        return result;
    }
}