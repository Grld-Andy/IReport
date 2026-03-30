using SafeZone.Modules.Identity.Core.Security;

namespace SafeZone.Modules.Identity.Core.Domain.Entities;

internal class User
{
    public Guid Id { get; set; } = default;
    public UserName Name { get; private set; } = default!;
    public UserEmail Email { get; } = default!;
    public UserPassword Password { get; private set; } = default!;
    public string Team { get; set; } = default!;
    public UserRole Role { get; } = default!;
    public string OTP { get; set; } = string.Empty;
    public UserStatus Status { get; private set; } = default!;
    public DateTime CreatedAt { get; private set; } = default;
    public DateTime UpdatedAt { get; private set; } = default;

    private User() { }

    private User(
        Guid id,
        UserName name,
        UserEmail email,
        UserPassword password,
        UserRole role,
        string team,
        string otp,
        DateTime now)
    {
        Id = id;
        Name = name;
        Email = email;
        Password = password;
        Team = team;
        OTP = otp;
        Role = role;
        Status = UserStatus.Inactive;
        CreatedAt = now;
        UpdatedAt = now;
    }

    public static User Register(
        UserName name,
        UserEmail email,
        UserPassword password,
        UserRole role,
        string team,
        string otp,
        DateTime now)
    {
        return new User(Guid.NewGuid(), name, email, password, role, team, otp, now);
    }

    public void GenerateOTP()
    {
        OTP = OTPGenerator.GenerateOTP();
        UpdatedAt = DateTime.UtcNow;
    }

    public void ActivateAccount(string password, DateTime now)
    {
        ResetPassword(password);
        ChangeStatus(UserStatus.From("Active"), now);
        OTP = string.Empty;
    }

    public void ChangeStatus(UserStatus newStatus, DateTime now)
    {
        if (!Status.CanTransitionTo(newStatus))
            throw new BadRequestException(
                $"Cannot transition from {Status} to {newStatus}");

        Status = newStatus;
        UpdatedAt = now;
    }

    public void ResetPassword(string newPassword)
    {
        Password = newPassword;
        UpdatedAt = DateTime.UtcNow;
    }

    public void ChangeName(UserName name, DateTime now)
    {
        Name = name;
        UpdatedAt = now;
    }
}