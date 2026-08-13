using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace SafeZone.Modules.Incident.Core.DAL;

internal sealed class IncidentDbContextFactory : IDesignTimeDbContextFactory<IncidentDbContext>
{
    public IncidentDbContext CreateDbContext(string[] args)
    {
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

        var connectionString =
            Environment.GetEnvironmentVariable("postgres__connectionString")
            ?? "Host=localhost;Port=5432;Database=safezone;Username=postgres;Password=postgres";

        var optionsBuilder = new DbContextOptionsBuilder<IncidentDbContext>();
        optionsBuilder.UseNpgsql(connectionString);
        return new IncidentDbContext(optionsBuilder.Options);
    }
}
