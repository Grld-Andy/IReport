namespace SafeZone.Modules.Identity.Core.Commands.ResendOtp;

internal record ResendOtpCommand(string Email) : ICommand;