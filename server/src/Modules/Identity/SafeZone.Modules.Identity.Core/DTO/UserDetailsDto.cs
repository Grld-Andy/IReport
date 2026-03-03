namespace SafeZone.Modules.Identity.Core.DTO;

internal class UserDetailsDto : UserDto{
    public Guid Id { get; set; } = default;
    public DateTime CreatedAt { get; set; } = default;
    public DateTime UpdatedAt { get;  set; } = default;
    public string Status { get;  set; } = default!;
}