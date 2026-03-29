namespace SafeZone.Modules.Notifications.Core.DTO;


public class EmailRequest
{
    public string To { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;

    public string? HtmlBody { get; set; }

    public List<string>? Cc { get; set; }
    public List<string>? Bcc { get; set; }
    public Dictionary<string, string>? Headers { get; set; }

    public string? TemplateName { get; set; }
    public object? Context { get; set; }
}