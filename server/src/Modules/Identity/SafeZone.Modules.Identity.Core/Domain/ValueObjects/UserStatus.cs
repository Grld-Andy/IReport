namespace SafeZone.Modules.Identity.Core.Domain.ValueObjects;

public sealed class UserStatus : IEquatable<UserStatus>
{
    public static readonly UserStatus Inactive = new(nameof(Inactive));
    public static readonly UserStatus Active = new(nameof(Active));
    public static readonly UserStatus Suspended = new(nameof(Suspended));
    public static readonly UserStatus Deleted = new(nameof(Deleted));

    public string Value { get; }

    private UserStatus(string value)
    {
        Value = value;
    }

    public static UserStatus From(string value)
    {
        return value switch
        {
            nameof(Inactive) => Inactive,
            nameof(Active) => Active,
            nameof(Suspended) => Suspended,
            nameof(Deleted) => Deleted,
            _ => throw new ArgumentException($"Invalid user status: {value}")
        };
    }

    public bool CanTransitionTo(UserStatus newStatus)
    {
        if (this == Deleted)
            return false;

        if (this == Inactive && newStatus == Active)
            return true;

        if (this == Active && (newStatus == Suspended || newStatus == Deleted))
            return true;

        if (this == Suspended && (newStatus == Active || newStatus == Deleted))
            return true;

        return false;
    }

    public override string ToString() => Value;

    public override bool Equals(object? obj) => Equals(obj as UserStatus);

    public bool Equals(UserStatus? other)
        => other is not null && Value == other.Value;

    public override int GetHashCode() => Value.GetHashCode();

    public static bool operator ==(UserStatus left, UserStatus right)
        => Equals(left, right);

    public static bool operator !=(UserStatus left, UserStatus right)
        => !Equals(left, right);
}