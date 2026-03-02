namespace SafeZone.Modules.Identity.Core.Domain.Entities;

internal class User
{
    public Guid Id { get; private set; }
    public UserName Name { get; private set; } = default!;
    public UserEmail Email { get; private set; } = default!;
    public string PasswordHashed { get; private set; } = default!;
    public string Role { get; private set; } = default!;
    public string Status { get; private set; } = default!;

    private User(){}

    public static User CreateUser(Guid id, string name, string email, string password, string role = "user", string status = "Inactive")
    {
        return new User()
        {
            Id = id,
            Name = name,
            Email = email,
            PasswordHashed = password,
            Role = role,
            Status = status
        };
    }

    // do a soft delete here, just set status to inactive
    public static void DeleteUser()
    {
        
    }

    public void UpdateUser(string name)
    {
        Name = name;
    }

    // for password change, might send an email with link to reset password
}