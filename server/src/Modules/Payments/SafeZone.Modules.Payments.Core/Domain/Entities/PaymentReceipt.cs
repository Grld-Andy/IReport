namespace SafeZone.Modules.Payments.Core.Domain.Entities;

internal class PaymentReceipt
{
    public Guid Id { get; set; }
    public string Reference { get; set; } = default!;
    public string Status { get; set; } = default!;
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;
    public DateTime? PaitAt { get; set; }
    public bool CheckedOut { get; set; } = false;
}