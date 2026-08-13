using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace SafeZone.Modules.Organization.Core.DAL;

internal sealed class OrganizationDbContextFactory : IDesignTimeDbContextFactory<OrganizationDbContext>
{
    public OrganizationDbContext CreateDbContext(string[] args)
    {
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

        var connectionString =
            Environment.GetEnvironmentVariable("postgres__connectionString")
            ?? "Host=localhost;Port=5432;Database=safezone;Username=postgres;Password=postgres";

        var optionsBuilder = new DbContextOptionsBuilder<OrganizationDbContext>();
        optionsBuilder.UseNpgsql(connectionString);
        return new OrganizationDbContext(optionsBuilder.Options);
    }
}
