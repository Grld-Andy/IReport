namespace SafeZone.Modules.Identity.Core.Domain.Entities;

internal class Company
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = default!;
    public string Extension { get; private set; } = default!;

    private Company(){}

    private Company(Guid id, string name, string extension)
    {
        Id = id;
        Name = name;
        Extension = extension;
    }

    public static Company AddCompany(Guid id, string name, string extension)
    {
        return new(id, name, extension);
    }

    public void UpdateCompany(string name, string extension)
    {
        Name = name;
        Extension = extension;
    }

}