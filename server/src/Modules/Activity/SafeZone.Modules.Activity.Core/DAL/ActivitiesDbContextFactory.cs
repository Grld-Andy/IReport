using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace SafeZone.Modules.Activity.Core.DAL;

internal sealed class ActivitiesDbContextFactory 
    : IDesignTimeDbContextFactory<ActivitiesDbContext>
{
    public ActivitiesDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ActivitiesDbContext>();

        // Hardcoded or read from env
        var connectionString =
            "Data Source=PSL-AANSONG\\SQLEXPRESS;Database=SafeZone;Integrated Security=True;Persist Security Info=False;Pooling=False;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=True;Application Name=\"SQL Server Management Studio\";Command Timeout=0";

        optionsBuilder.UseSqlServer(connectionString);

        return new ActivitiesDbContext(optionsBuilder.Options);
    }
}