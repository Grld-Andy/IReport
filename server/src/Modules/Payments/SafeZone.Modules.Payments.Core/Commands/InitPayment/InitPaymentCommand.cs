namespace SafeZone.Modules.Payments.Core.Commands.InitPayment;

internal record InitPaymentCommand(InitializePaymentRequest Request) : ICommand<InitializePaymentResponse>;