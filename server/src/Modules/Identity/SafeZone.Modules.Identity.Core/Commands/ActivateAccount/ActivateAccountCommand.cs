namespace SafeZone.Modules.Identity.Core.Commands.ActivateAccount;

internal record ActivateAccountCommand(string Email, string OTP, string Password, string PasswordConfirm) : ICommand;