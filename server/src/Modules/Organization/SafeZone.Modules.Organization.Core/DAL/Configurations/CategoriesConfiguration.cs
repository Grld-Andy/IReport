using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SafeZone.Modules.Organization.Core.DAL.Configurations;

internal class CategoriesConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("Categories");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Name)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(t => t.CompanyId)
            .IsRequired();

        builder.HasIndex(t => new { t.CompanyId, t.Name })
            .IsUnique();

        builder.HasIndex(t => t.CompanyId);
    }
}