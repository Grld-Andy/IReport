namespace SafeZone.Modules.Identity.Core.Domain.ValueObjects;

public record UserEmail
{
    public string Value { get; } = string.Empty;

    public UserEmail(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new BadRequestException("Please provide email");
        }
        if (!Value.Contains('@'))
        {
            throw new BadRequestException("Please enter a valid email");
        }

        Value = value.ToLowerInvariant();
    }

    private UserEmail(){}

    public static implicit operator string(UserEmail email) => email.Value;
    public static implicit operator UserEmail(string value) => new(value);
}