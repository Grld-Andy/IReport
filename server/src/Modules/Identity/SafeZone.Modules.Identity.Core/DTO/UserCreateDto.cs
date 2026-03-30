namespace SafeZone.Modules.Identity.Core.DTO;

internal class UserCreateDto : UserDto{
    public string OTP { get;  set; } = default!;
}