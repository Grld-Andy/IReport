namespace SafeZone.Modules.Identity.Core.Domain.ValueObjects;

internal record UserPassword
{
    public string Value { get; } = string.Empty;

    public UserPassword(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new BadRequestException("Please provide password");
        }
        if(value.Length < 6)
        {
            throw new BadRequestException("Password length must be greater thatn 6");
        }
        Value = value;
    }

    public static implicit operator string(UserPassword password) => password.Value;
    public static implicit operator UserPassword(string value) => new(value);
}