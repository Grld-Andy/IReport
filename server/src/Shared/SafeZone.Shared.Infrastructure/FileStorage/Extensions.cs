using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SafeZone.Shared.Abstractions.FileStorage;

namespace SafeZone.Shared.Infrastructure.FileStorage;

internal static class Extensions
{
    private const string SectionName = "supabase";

    public static IServiceCollection AddSupabaseStorage(this IServiceCollection services, IConfiguration configuration)
    {
        var section = configuration.GetSection(SectionName);
        services.Configure<SupabaseOptions>(section);
        services.AddHttpClient<IFileStorage, SupabaseFileStorage>();
        return services;
    }
}
