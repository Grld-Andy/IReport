namespace SafeZone.Modules.Identity.Core.Domain.ValueObjects;

public record UserEmail
{
    public string Value { get; } = string.Empty;

    public UserEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            throw new BadRequestException("Please provide email");
        }

        Value = email;
    }

    public static implicit operator string(UserEmail email) => email.Value;
    public static implicit operator UserEmail(string value) => new(value);
}