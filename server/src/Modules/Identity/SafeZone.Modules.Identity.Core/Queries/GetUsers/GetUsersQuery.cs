namespace SafeZone.Modules.Identity.Core.Queries.GetUsers;

internal class GetUsersQuery : PagedQuery<UserDetailsDto>
{
    public string? Filter { get; set; } = "";
    public string? Role { get; set; } = "";
    public string? Status { get; set; } = "";
}