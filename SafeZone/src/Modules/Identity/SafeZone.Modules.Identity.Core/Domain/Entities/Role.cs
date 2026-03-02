namespace SafeZone.Modules.Identity.Core.Domain.Entities;

public class Role
{
    public string Name { get; set; } = string.Empty;
    public static string Defualt => User;
    public const string User = "user";
    public const string Admin = "admin";
    public const string Supervisor = "Supervisor";
    public const string Responder = "Responder";

    private Role(){}

    public Role(string name)
    {
        
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new BadRequestException("Please provide role name");
        }

        Name = name;
    }

    public static implicit operator string(Role role) => role.Name;
    public static implicit operator Role(string value) => new(value);
}