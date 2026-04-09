using Microsoft.EntityFrameworkCore;
using Safezone.Modules.Payments.Core.Domain.Repositories;
using SafeZone.Modules.Payments.Core.DAL;
using SafeZone.Modules.Payments.Core.Domain.Entities;
using SafeZone.Shared.Abstractions.Exceptions.ExceptionClasses;

namespace Safezone.Modules.Payments.Core.DAL.Repositories;

internal class PaymentRepository(PaymentDbContext _paymentDbContext) : IPaymentRepository
{
    private readonly PaymentDbContext paymentDbContext = _paymentDbContext;

    public async Task AddAsync(PaymentReceipt receipt, CancellationToken cancellationToken = default)
    {
        paymentDbContext.Payments.Add(receipt);
        await SaveAsycn(cancellationToken);
    }

    public async Task<PaymentReceipt> GetAsync(string reference, CancellationToken cancellationToken = default)
    {
        return await paymentDbContext.Payments.FirstOrDefaultAsync(p => p.Reference == reference, cancellationToken: cancellationToken)
            ?? throw new NotFoundException("Payment not found");
    }

    public async Task SaveAsycn(CancellationToken cancellationToken = default)
    {
        await paymentDbContext.SaveChangesAsync(cancellationToken);
    }
}