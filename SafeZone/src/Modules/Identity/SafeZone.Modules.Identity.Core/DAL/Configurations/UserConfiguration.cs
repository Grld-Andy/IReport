using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SafeZone.Modules.Identity.Core.DAL.Configurations;

internal class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id.Value);
        builder.OwnsOne(u => u.Email, email =>
        {
            email.Property(e => e.Value).HasColumnName("Email").IsRequired();
        });
        builder.OwnsOne(u => u.Password, password =>
        {
            password.Property(p => p.Value).HasColumnName("Password").IsRequired();
        });
        builder.OwnsOne(u => u.Role, role =>
        {
            role.Property(r => r.Value).HasColumnName("Role").IsRequired();
        });
        builder.OwnsOne(u => u.Status, status =>
        {
            status.Property(s => s.Value).HasColumnName("Status").IsRequired();
        });
    }
}