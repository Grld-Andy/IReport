namespace SafeZone.Modules.Identity.Core.Domain.Repositories;

internal interface IUserRepository
{
    Task<UserDetailsDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<User> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<Paged<UserDetailsDto>> GetAllAsync(IPagedQuery query, CancellationToken cancellationToken = default);
    Task SaveAsync(CancellationToken cancellationToken = default);
    Task CreateAsync(User user, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    Task<bool> SoftDeleteAsync(Guid id, CancellationToken cancellationToken = default);
}