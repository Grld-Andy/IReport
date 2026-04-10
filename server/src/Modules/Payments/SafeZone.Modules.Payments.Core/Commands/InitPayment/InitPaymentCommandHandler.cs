using Safezone.Modules.Payments.Core.Domain.Repositories;
using SafeZone.Modules.Payments.Core.DAL;
using SafeZone.Modules.Payments.Core.Domain.Entities;
using SafeZone.Modules.Payments.Core.Services;

namespace SafeZone.Modules.Payments.Core.Commands.InitPayment;

internal class InitPaymentCommandHandler(PaystackService _paystackService, IPaymentRepository _paymentRepo) : ICommandHandler<InitPaymentCommand, InitializePaymentResponse>
{
    private readonly PaystackService paystackService = _paystackService;
    private readonly IPaymentRepository paymentRepo = _paymentRepo;

    async Task<InitializePaymentResponse> ICommandHandler<InitPaymentCommand, InitializePaymentResponse>.HandleAsync(InitPaymentCommand command, CancellationToken cancellationToken)
    {
        var data = command.Request;
        var request = new InitializePaymentRequest
        {
            Email = data.Email,
            Channels = data.Channels,
            Currency = data.Currency,
            Plan = data.Plan
        };
        var response = await paystackService.InitializePayment(request);

        PaymentReceipt receipt = new()
        {
            Id = Guid.NewGuid(),
            Reference = response.Data.Reference,
            Status = "pending",
            DateCreated = DateTime.UtcNow,
            CheckedOut = false
        };
        await paymentRepo.AddAsync(receipt, cancellationToken);
        return response;
    }
}