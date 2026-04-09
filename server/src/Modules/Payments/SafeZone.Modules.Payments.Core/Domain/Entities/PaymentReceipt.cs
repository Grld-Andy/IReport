namespace SafeZone.Modules.Payments.Core.Domain.Entities;

internal class PaymentReceipt
{
    public Guid Id { get; set; }
    public string Reference { get; set; } = default!;
    public bool Status { get; set; }
    public DateTime PaitAt { get; set; }
    public string RawResponse { get; set; } = string.Empty;
}