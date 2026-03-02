namespace SafeZone.Modules.Identity.Core.Domain.ValueObjects;

public record UserName
{
    public string Value { get; } = string.Empty;

    public UserName(string userName)
    {
        if (string.IsNullOrWhiteSpace(userName))
        {
            throw new BadRequestException("Please provide username");
        }

        Value = userName;
    }

    public static implicit operator string(UserName userName) => userName.Value;
    public static implicit operator UserName(string value) => new(value);
}