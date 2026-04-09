namespace SafeZone.Modules.Payment.Core.DTO;

internal class PaystackVerifyResponse
{
   [JsonPropertyName("status")]
   public bool Status { get; set; }
   
   [JsonPropertyName("message")]
   public string Message { get; set; } = string.Empty;
}