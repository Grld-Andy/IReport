using System.Runtime.CompilerServices;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Safezone.Modules.Payments.Core.DAL.Repositories;
using Safezone.Modules.Payments.Core.Domain.Repositories;
using SafeZone.Modules.Payments.Core.DAL;
using SafeZone.Modules.Payments.Core.Services;
using SafeZone.Shared.Infrastructure.Postgres;

[assembly: InternalsVisibleTo("SafeZone.Modules.Payments.Api")]
namespace Safezone.Modules.Payments.Core;

internal static class Extensions
{
    public static IServiceCollection AddCore(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHttpClient<PaystackService>();
        services.AddScoped<IPaymentRepository, PaymentRepository>();
        services.AddPostgres<PaymentDbContext>(configuration);
        return services;
    }
}