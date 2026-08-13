using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace SafeZone.Modules.Activity.Core.DAL;

internal sealed class ActivitiesDbContextFactory : IDesignTimeDbContextFactory<ActivitiesDbContext>
{
    public ActivitiesDbContext CreateDbContext(string[] args)
    {
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

        var connectionString =
            Environment.GetEnvironmentVariable("postgres__connectionString")
            ?? "Host=localhost;Port=5432;Database=safezone;Username=postgres;Password=postgres";

        var optionsBuilder = new DbContextOptionsBuilder<ActivitiesDbContext>();
        optionsBuilder.UseNpgsql(connectionString);
        return new ActivitiesDbContext(optionsBuilder.Options);
    }
}
