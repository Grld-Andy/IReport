namespace SafeZone.Modules.Organization.Core.Domain.Entities;

internal class Team
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = default!;
    public Guid CompanyId { get; private set; }
    public bool IsActive { get; private set; } = true;
}