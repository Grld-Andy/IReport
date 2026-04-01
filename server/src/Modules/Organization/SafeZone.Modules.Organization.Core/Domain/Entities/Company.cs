namespace SafeZone.Modules.Organization.Core.Domain.Entities;

internal class Company
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = default!;
    public string LogoUrl { get; private set; } = default!;
    public bool IsActive { get; private set; } = true;
    public DateTime CreatedAt { get; private set; } = new DateTime();
    public DateTime UpdatedAt { get; private set; }

    public List<Team> Teams { get; set; } = [];
}