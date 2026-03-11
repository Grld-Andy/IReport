using Microsoft.EntityFrameworkCore;
using SafeZone.Modules.Activity.Core.Domain.Entities;

namespace SafeZone.Modules.Activity.Core.DAL;

internal class ActivitiesDbContext(DbContextOptions<ActivitiesDbContext> options) : DbContext(options)
{
    public DbSet<ActivityEntity> Activities => Set<ActivityEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("activities");
        modelBuilder.ApplyConfigurationsFromAssembly(GetType().Assembly);
    }
}