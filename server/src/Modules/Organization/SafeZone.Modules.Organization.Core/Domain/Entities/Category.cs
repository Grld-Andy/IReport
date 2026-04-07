namespace SafeZone.Modules.Organization.Core.Domain.Entities;

internal class Category{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = default!;
    public Guid CompanyId { get; private set; }

    private Category(){}

    private Category(string name, Guid companyId)
    {
        Name = name;
        CompanyId = companyId;
    }

    public static Category AddCategory(string name, Guid companyId)
    {
        return new Category(name, companyId);
    }
}