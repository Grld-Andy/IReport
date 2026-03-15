namespace SafeZone.Modules.Identity.Core.Commands.ResetPassword;

internal record ResetPasswordCommand(string CurrentPassword, string Password, string ConfirmPassword) : ICommand;