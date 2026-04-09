using System.Text.Json.Serialization;

namespace SafeZone.Modules.Payments.Core.DTO;

internal class InitializePaymentRequest
{
    public string Email { get; set; } = string.Empty;
    public List<string>? Channels { get; set; }
    public string? Currency { get; set; } = "GHS";
    public string? Plan { get; set; }
}

internal class InitializePaymentResponse
{
    [JsonPropertyName("status")]
    public bool Status { get; set; }

    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;

    [JsonPropertyName("data")]
    public DataBody Data { get; set; } = new DataBody();
}

internal class DataBody
{
    [JsonPropertyName("authorization_url")]
    public string AuthorizationUrl { get; set; } = string.Empty;

    [JsonPropertyName("access_code")]
    public string AccessCode { get; set; } = string.Empty;

    [JsonPropertyName("reference")]
    public string Reference { get; set; } = string.Empty;
}