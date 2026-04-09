using SafeZone.Modules.Payments.Core.Services;
using SafeZone.Shared.Abstractions.Queries;

namespace SafeZone.Modules.Payments.Core.Queries.VerifyPayment;

internal record VerifyPaymentQueryHandler(PaystackService _paystackService) : IQueryHandler<VerifyPaymentQuery, string>
{
    private readonly PaystackService paystackService = _paystackService;
    public async Task<string> HandleAsync(VerifyPaymentQuery query, CancellationToken cancellationToken = default)
    {
        return await paystackService.VerifyPaymentService(query.Reference);
    }
}