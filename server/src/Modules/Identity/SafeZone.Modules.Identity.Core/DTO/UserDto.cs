namespace SafeZone.Modules.Identity.Core.DTO;

internal class UserDto{
    public string Name { get;  set; } = default!;
    public string Email { get; set; } = default!;
    public string Role { get; set; } = default!;
}