namespace SafeZone.Modules.Incident.Core.Domain.Entities;

internal class IncidentUser
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = default!;
    public string Email { get; private set; } = default!;
    public string Role { get; private set; } = default!;
    public Guid CompanyId { get; private set; } = default!;
    public DateTime CreatedAt { get; private set; }

    private IncidentUser() { }

    public static IncidentUser Create(Guid id, string name, string email, string role, Guid companyId)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BadRequestException("Full name must be provided.", nameof(name));

        if (string.IsNullOrWhiteSpace(email) || !email.Contains('@'))
            throw new BadRequestException("Valid email must be provided.", nameof(email));

        if (string.IsNullOrWhiteSpace(role))
            throw new BadRequestException("Role must be provided.", nameof(role));

        return new IncidentUser
        {
            Id = id,
            Name = name,
            Email = email,
            Role = role,
            CompanyId = companyId,
            CreatedAt = DateTime.UtcNow
        };
    }
}