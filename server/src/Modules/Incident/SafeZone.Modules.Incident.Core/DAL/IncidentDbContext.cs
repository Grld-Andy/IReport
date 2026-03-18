namespace SafeZone.Modules.Incident.Core.DAL;

internal sealed class IncidentDbContext(DbContextOptions<IncidentDbContext> options) : DbContext(options)
{
    public DbSet<IncidentEntity> Incidents => Set<IncidentEntity>();
    public DbSet<IncidentUser> Users => Set<IncidentUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("incidents");
        modelBuilder.ApplyConfigurationsFromAssembly(GetType().Assembly);
    }
}