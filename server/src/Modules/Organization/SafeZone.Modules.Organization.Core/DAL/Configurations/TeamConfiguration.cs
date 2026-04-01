using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SafeZone.Modules.Organization.Core.DAL.Configurations;

internal class TeamConfiguration : IEntityTypeConfiguration<Team>
{
    public void Configure(EntityTypeBuilder<Team> builder)
    {
        builder.ToTable("Teams");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Name)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(t => t.CompanyId)
            .IsRequired();

        builder.Property(t => t.IsActive)
            .IsRequired();

        builder.HasIndex(t => new { t.CompanyId, t.Name })
            .IsUnique()
            .HasFilter("[IsActive] = 1");

        builder.HasIndex(t => t.CompanyId);
    }
}