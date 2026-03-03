namespace SafeZone.Modules.Incident.Core.DAL.Configurations;

internal sealed class IncidentConfiguration : IEntityTypeConfiguration<IncidentEntity>
{
    public void Configure(EntityTypeBuilder<IncidentEntity> builder)
    {
        builder.ToTable("Incidents");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id)
            .ValueGeneratedNever();

        builder.Property(x => x.Category)
            .HasConversion<int>()
            .IsRequired();
        builder.Property(x => x.Severity)
            .HasConversion<int>()
            .IsRequired();
        builder.Property(x => x.Status)
            .HasConversion<int>()
            .IsRequired();
        builder.Property(x => x.IsDeleted)
            .IsRequired();

        builder.HasQueryFilter(x => !x.IsDeleted);

        builder.OwnsOne(x => x.Subject, subject =>
        {
            subject.Property(s => s.Value)
                .HasColumnName("Subject")
                .HasMaxLength(200)
                .IsRequired();
        });
        builder.OwnsOne(x => x.Description, description =>
        {
            description.Property(d => d.Value)
                .HasColumnName("Description")
                .HasMaxLength(2000)
                .IsRequired();
        });
        builder.OwnsOne(x => x.Location, location =>
        {
            location.Property(l => l.Latitude)
                .HasColumnName("Latitude")
                .IsRequired();

            location.Property(l => l.Longitude)
                .HasColumnName("Longitude")
                .IsRequired();

            location.Property(l => l.ExtraDetails)
                .HasColumnName("LocationDetails")
                .HasMaxLength(500)
                .IsRequired();
        });

        builder.Property(x => x.ReporterId)
            .IsRequired();
        builder.Property(x => x.AssignedToId)
            .IsRequired(false);
        builder.Property(x => x.CreatedAt)
            .IsRequired();
        builder.Property(x => x.UpdatedAt)
            .IsRequired();

        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.Severity);
        builder.HasIndex(x => x.Category);
    }
}