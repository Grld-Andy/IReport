namespace SafeZone.Modules.Payment.Core.DTO;

internal class PaystackInitateRequest
{
    [Required]
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [JsonPropertyName("amount")]
    [Range(100, 10000000, ErrorMessage = "Amount must be between {1} and {2}")]
    public string Amount { get; set; } = string.Empty;
}