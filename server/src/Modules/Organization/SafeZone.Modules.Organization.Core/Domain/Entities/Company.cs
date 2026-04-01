namespace SafeZone.Modules.Organization.Core.Domain.Entities;

internal class Company
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = default!;
    public string LogoUrl { get; private set; } = default!;
    public bool IsActive { get; private set; } = true;
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; private set; } = DateTime.UtcNow;

    public List<Team> Teams { get; set; } = [];

    private Company(){}

    private Company(string name, string logoUrl)
    {
        Name = name;
        LogoUrl = logoUrl;
    }

    public static Company AddCompany(string name, string logoUrl)
    {
        return new(name, logoUrl);
    }

    public void UpdateCompany(string name, string logoUrl)
    {
        Name = name;
        LogoUrl = logoUrl;
        UpdatedAt = DateTime.UtcNow;
    }

}