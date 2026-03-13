namespace SafeZone.Modules.Identity.Core.DTO;

internal class UserCreateDto : UserDto{
    public string Password { get;  set; } = default!;
    public string ConfirmPassword { get; set; } = default!;
}