namespace SafeZone.Modules.Organization.Core.Domain.Entities;

internal class Team
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = default!;
    public Guid CompanyId { get; private set; }
    public bool IsActive { get; private set; } = true;

    private Team(){}

    private Team(string name, Guid companyId)
    {
        Name = name;
        CompanyId = companyId;
    }

    public static Team AddTeam(string name, Guid companyId)
    {
        return new Team(name, companyId)
        {
            IsActive = true
        };
    }

    public void DeleteTeam()
    {
        IsActive = false;
    }
}