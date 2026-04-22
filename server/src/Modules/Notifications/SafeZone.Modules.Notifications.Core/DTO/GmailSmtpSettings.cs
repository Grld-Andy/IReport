namespace SafeZone.Modules.Notifications.Core.DTO;

internal class GmailSmtpSettings
{
    public string Email { get; set; } = string.Empty;
    public string FromName { get; set; } = string.Empty;
    public string AppPassword { get; set; } = string.Empty;
}