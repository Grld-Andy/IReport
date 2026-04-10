using Microsoft.EntityFrameworkCore;
using SafeZone.Modules.Payments.Core.Domain.Entities;

namespace SafeZone.Modules.Payments.Core.DAL;

internal class PaymentDbContext(DbContextOptions<PaymentDbContext> options) : DbContext(options)
{
    public DbSet<PaymentReceipt> Payments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("payments");
        modelBuilder.ApplyConfigurationsFromAssembly(GetType().Assembly);
    }
}