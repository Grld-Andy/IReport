using System.Text.Json.Serialization;

namespace SafeZone.Modules.Payments.Core.DTO;

internal class VerifyPaymentResponse
{
    [JsonPropertyName("status")]
    public bool Status { get; set; }

    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;
    
    [JsonPropertyName("meta")]
    public Meta Meta { get; set; } = new();
    
    [JsonPropertyName("type")]
    public string Type { get; set; } = string.Empty;
    
    [JsonPropertyName("code")]
    public string Code { get; set; } = string.Empty;
}

internal class Meta
{
    [JsonPropertyName("nextStep")]
    public string NextStep { get; set; } = string.Empty;
}