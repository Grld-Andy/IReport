using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace SafeZone.Modules.Activity.Core.DAL;

internal sealed class ActivitiesDbContextFactory 
    : IDesignTimeDbContextFactory<ActivitiesDbContext>
{
    public ActivitiesDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ActivitiesDbContext>();

        // Hardcoded or read from env
        var connectionString =
            "Host=localhost;Port=5432;Database=safezone;Username=postgres;Password=postgres";

        optionsBuilder.UseNpgsql(connectionString);

        return new ActivitiesDbContext(optionsBuilder.Options);
    }
}