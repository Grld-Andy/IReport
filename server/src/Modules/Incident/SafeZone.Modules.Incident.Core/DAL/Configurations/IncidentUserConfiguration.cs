namespace SafeZone.Modules.Incident.Core.DAL.Configurations;

internal sealed class IncidentUserConfiguration : IEntityTypeConfiguration<IncidentUser>
{
    public void Configure(EntityTypeBuilder<IncidentUser> builder)
    {
        builder.ToTable("IncidentUsers");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(x => x.Email)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(x => x.Role)
            .HasMaxLength(50)
            .IsRequired();
    }
}