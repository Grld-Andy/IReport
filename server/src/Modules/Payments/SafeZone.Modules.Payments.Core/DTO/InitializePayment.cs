namespace SafeZone.Modules.Payments.Core.DTO;

internal class InitializePaymentRequest
{
    public string Email { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public List<string>? Channels { get; set; }
    public string? Currency { get; set; } = "GHS";
    public string? Plan { get; set; }
}

internal class InitializePaymentResponse
{
  public bool Status { get; set; }
  public string Message { get; set; } = string.Empty;
  public DataBody Data {get; set; } = new DataBody();
}

internal class DataBody
{
    public string Authorization_Url { get; set; } = string.Empty;
    public string Access_Code { get; set; } = string.Empty;
    public string Reference { get; set; } = string.Empty;
}