namespace SafeZone.Modules.Identity.Core.Domain.Entities;

public sealed class UserRole : IEquatable<UserRole>
{
    public static readonly UserRole User = new("user");
    public static readonly UserRole Admin = new("admin");
    public static readonly UserRole Supervisor = new("supervisor");
    public static readonly UserRole Responder = new("responder");

    private static readonly Dictionary<string, UserRole> Roles =
        new(StringComparer.OrdinalIgnoreCase)
        {
            ["user"] = User,
            ["admin"] = Admin,
            ["supervisor"] = Supervisor,
            ["responder"] = Responder
        };

    public string Value { get; }

    private UserRole(string value)
    {
        Value = value;
    }

    public static UserRole From(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Role cannot be empty.");

        if (!Roles.TryGetValue(value.Trim(), out var role))
            throw new ArgumentException($"Invalid user role: {value}");

        return role;
    }

    public bool IsAdmin() => this == Admin;
    public bool IsSupervisor() => this == Supervisor;
    public bool IsResponder() => this == Responder;
    public bool IsUser() => this == User;

    public override string ToString() => Value;

    public override bool Equals(object? obj) => Equals(obj as UserRole);

    public bool Equals(UserRole? other)
        => other is not null && Value.Equals(other.Value, StringComparison.OrdinalIgnoreCase);

    public override int GetHashCode()
        => StringComparer.OrdinalIgnoreCase.GetHashCode(Value);

    public static bool operator ==(UserRole left, UserRole right)
        => Equals(left, right);

    public static bool operator !=(UserRole left, UserRole right)
        => !Equals(left, right);
}