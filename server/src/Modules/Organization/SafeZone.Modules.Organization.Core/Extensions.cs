using System.Runtime.CompilerServices;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SafeZone.Modules.Organization.Core.DAL;
using SafeZone.Modules.Organization.Core.DAL.Repositories;
using SafeZone.Shared.Infrastructure;
using SafeZone.Shared.Infrastructure.Postgres;

[assembly: InternalsVisibleTo("SafeZone.Modules.Organization.Api")]
namespace SafeZone.Modules.Organization.Core;

internal static class Extensions
{
    public static IServiceCollection AddCore(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<ITeamRepository, TeamRepository>();
        services.AddScoped<ICompanyRepository, CompanyRepository>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<Bucket>();
        services.AddPostgres<OrganizationDbContext>(configuration);
        services.AddInitializer<OrganizationInitializer>();
        return services;
    }
}