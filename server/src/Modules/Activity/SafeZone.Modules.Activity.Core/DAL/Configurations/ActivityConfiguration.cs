using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SafeZone.Modules.Activity.Core.Domain.Entities;

namespace SafeZone.Modules.Activity.Core.DAL.Configurations;

internal sealed class ActivityConfiguration : IEntityTypeConfiguration<ActivityEntity>
{
    public void Configure(EntityTypeBuilder<ActivityEntity> builder)
    {
        builder.ToTable("Activities");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.ActorId)
            .IsRequired(false);

        builder.Property(x => x.ActorName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Action)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(x => x.Details)
            .HasMaxLength(500);

        builder.Property(x => x.Module)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.HasIndex(x => x.CreatedAt);
    }
}