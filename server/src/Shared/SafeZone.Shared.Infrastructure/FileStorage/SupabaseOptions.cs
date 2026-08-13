namespace SafeZone.Shared.Infrastructure.FileStorage;

public class SupabaseOptions
{
    public string Url { get; set; } = string.Empty;
    public string ServiceRoleKey { get; set; } = string.Empty;
    public string Bucket { get; set; } = "safezone";
}
