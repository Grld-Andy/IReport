using Safezone.Modules.Payments.Core.Domain.Repositories;
using SafeZone.Modules.Payments.Core.Services;
using SafeZone.Shared.Abstractions.Events;
using SafeZone.Shared.Abstractions.Exceptions.ExceptionClasses;

namespace SafeZone.Modules.Payments.Core.Events.External;

internal class CompanyRegisteredEventHandler(PaystackService _paystackService, IPaymentRepository _paymentRepository) : IEventHandler<CompanyRegisteredEvent>
{
    private readonly PaystackService paystackService = _paystackService;
    private readonly IPaymentRepository paymentRepository = _paymentRepository;

    public async Task HandleAsync(CompanyRegisteredEvent @event, CancellationToken cancellationToken = default)
    {
        Console.WriteLine($"=================== payment reference is {@event.PaymentRef}");
        var response = await paystackService.VerifyPaymentService(@event.PaymentRef);
        Console.WriteLine($"response is {response}");
        if (!response.Status)
        {
            throw new BadRequestException("Please make payment before proceeding");
        }
        var payment = await paymentRepository.GetAsync(@event.PaymentRef, cancellationToken);
        if (payment.CheckedOut)
        {
            throw new BadRequestException("Payment reference already checked out");
        }
        payment.PaitAt = DateTime.UtcNow;
        payment.Status = "paid";
        payment.CheckedOut = true;
        await paymentRepository.SaveAsycn(cancellationToken);
    }
}
