namespace SafeZone.Modules.Identity.Core.Domain.Entities;

internal class Company
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = default!;
    public string Extension { get; private set; } = default!;
    public string LogoUrl { get; private set; } = string.Empty;

    private Company(){}

    private Company(Guid id, string name, string extension, string logoUrl)
    {
        Id = id;
        Name = name;
        Extension = extension;
        LogoUrl = logoUrl;
    }

    public static Company AddCompany(Guid id, string name, string extension, string logoUrl = "")
    {
        return new(id, name, extension, logoUrl);
    }

    public void UpdateCompany(string name, string extension, string logoUrl)
    {
        Name = name;
        Extension = extension;
        LogoUrl = logoUrl;
    }
}
