using SafeZone.Shared.Abstractions.Domain;

namespace SafeZone.Modules.Identity.Core.Domain.Entities;

internal class User : AggregateRoot
{
    public UserName Name { get; private set; }
    public UserEmail Email { get; }
    public UserPassword Password { get; private set; }
    public UserRole Role { get; }
    public UserStatus Status { get; private set; }
    public DateTime CreatedAt { get; }
    public DateTime UpdatedAt { get; private set; }

    private User() { }

    private User(
        Guid id,
        UserName name,
        UserEmail email,
        UserPassword password,
        UserRole role,
        DateTime now)
    {
        Id = id;
        Name = name;
        Email = email;
        Password = password;
        Role = role;
        Status = UserStatus.Inactive;
        CreatedAt = now;
        UpdatedAt = now;
    }

    public static User Register(
        Guid id,
        UserName name,
        UserEmail email,
        UserPassword password,
        UserRole role,
        DateTime now)
    {
        return new User(id, name, email, password, role, now);
    }

    public void ChangeStatus(UserStatus newStatus, DateTime now)
    {
        if (!Status.CanTransitionTo(newStatus))
            throw new BadRequestException(
                $"Cannot transition from {Status} to {newStatus}");

        Status = newStatus;
        UpdatedAt = now;
    }

    public void ChangeName(UserName name, DateTime now)
    {
        Name = name;
        UpdatedAt = now;
    }
}