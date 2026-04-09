using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SafeZone.Modules.Payments.Core.Domain.Entities;

namespace Safezone.Modules.Payments.Core.DAL.Configurations;

internal class PaymentConfiguration : IEntityTypeConfiguration<PaymentReceipt>
{
    public void Configure(EntityTypeBuilder<PaymentReceipt> builder)
    {
        builder.ToTable("receipts");
        builder.HasKey(p => p.Id);
        builder.HasIndex(p => p.Reference).IsUnique();
    }
}