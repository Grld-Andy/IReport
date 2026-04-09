using Safezone.Modules.Payments.Core.Domain.Repositories;
using SafeZone.Modules.Payments.Core.DAL;
using SafeZone.Modules.Payments.Core.Domain.Entities;
using SafeZone.Modules.Payments.Core.Services;

namespace SafeZone.Modules.Payments.Core.Commands.InitPayment;

internal class InitPaymentCommandHandler(PaystackService paystackService, IPaymentRepository _paymentRepo) : ICommandHandler<InitPaymentCommand, InitializePaymentResponse>
{
    private readonly PaystackService _paystackService = paystackService;
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
        var response = await _paystackService.InitializePayment(request);

        PaymentReceipt receipt = new()
        {
            Id = Guid.NewGuid(),
            Reference = response.Data.Reference,
            Status = "pending"
        };
        await paymentRepo.AddAsync(receipt);
        return response;
    }
}