using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SafeZone.Modules.Identity.Core.DAL.Configurations;

internal class CompanyConfiguration : IEntityTypeConfiguration<Company>
{
    public void Configure(EntityTypeBuilder<Company> builder)
    {
        builder.ToTable("Companies");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(c => c.Extension)
            .IsRequired()
            .HasMaxLength(10);
    }
}