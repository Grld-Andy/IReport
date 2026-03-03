namespace SafeZone.Modules.Identity.Core.Domain.ValueObjects;

public record UserEmail
{
    public string Value { get; } = string.Empty;
    public Guid UserId { get; private set; }

    public UserEmail(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new BadRequestException("Please provide email");
        }
        if (!value.Contains('@'))
        {
            throw new BadRequestException("Please enter a valid email");
        }

        Value = value.ToLower();
    }

    private UserEmail(){}

    public static implicit operator string(UserEmail email) => email.Value;
    public static implicit operator UserEmail(string value) => new(value);
}