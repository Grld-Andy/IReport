namespace SafeZone.Modules.Identity.Core.Domain.ValueObjects;

public record UserName
{
    public string Value { get; } = string.Empty;

    private UserName(){}

    public UserName(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new BadRequestException("Please provide username");
        }

        Value = value;
    }

    public static implicit operator string(UserName userName) => userName.Value;
    public static implicit operator UserName(string value) => new(value);
}