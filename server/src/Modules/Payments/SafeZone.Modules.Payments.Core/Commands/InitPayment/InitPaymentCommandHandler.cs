using SafeZone.Modules.Payments.Core.Services;

namespace SafeZone.Modules.Payments.Core.Commands.InitPayment;

internal record InitPaymentCommandHandler(PaystackService PaystackService) : ICommandHandler<InitPaymentCommand, InitializePaymentResponse>
{
    private readonly PaystackService _paystackService = PaystackService;

    async Task<InitializePaymentResponse> ICommandHandler<InitPaymentCommand, InitializePaymentResponse>.HandleAsync(InitPaymentCommand command, CancellationToken cancellationToken)
    {
        var data = command.Request;
        var request = new InitializePaymentRequest
        {
            Email = data.Email,
            Amount = data.Amount,
            Channels = data.Channels,
            Currency = data.Currency,
            Plan = data.Plan
        };
        return await _paystackService.InitializePayment(request);
    }
}