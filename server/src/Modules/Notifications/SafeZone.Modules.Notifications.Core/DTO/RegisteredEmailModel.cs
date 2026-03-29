namespace SafeZone.Modules.Notifications.Core.DTO;

internal class RegisteredEmailModel
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Team { get; set; } = string.Empty;
    public string OTP { get; set; } = string.Empty;
    public string LoginUrl { get; set; } = string.Empty;
}