namespace SafeZone.Modules.Payment.Core.Domain.Entities;

public class Payment
{
    public Guid Id { get; set; }

    public string Reference { get; set; } = default!; // Paystack reference
    public string Email { get; set; } = default!;
    public int Amount { get; set; } // in pesewas (smallest unit)

    public string Status { get; set; } = "pending"; 
    // pending | success | failed

    public string Channel { get; set; } = default!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? PaidAt { get; set; }

    public string? RawResponse { get; set; } // store Paystack response (important)
}