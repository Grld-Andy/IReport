using SafeZone.Modules.Payments.Core.Domain.Entities;

namespace Safezone.Modules.Payments.Core.Domain.Repositories;

internal interface IPaymentRepository
{
    Task AddAsync(PaymentReceipt receipt, CancellationToken cancellationToken = default);
    Task<PaymentReceipt> GetAsync(string reference, CancellationToken cancellationToken = default);
    Task SaveAsycn(CancellationToken cancellationToken = default);
}