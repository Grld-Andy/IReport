using System.Runtime.CompilerServices;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SafeZone.Modules.Activity.Core.DAL;
using SafeZone.Modules.Activity.Core.Domain.Repositories;
using SafeZone.Shared.Infrastructure.Postgres;

[assembly: InternalsVisibleTo("SafeZone.Modules.Activity.Api")]
namespace SafeZone.Modules.Activity.Core;

internal static class Extensions
{
    public static IServiceCollection AddCore(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddScoped<IActivityRepository, ActivityRepository>()
            .AddPostgres<ActivitiesDbContext>(configuration);
        return services;
    }
}