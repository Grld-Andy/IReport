using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SafeZone.Modules.Identity.Core;
using SafeZone.Modules.Identity.Core.DTO;
using SafeZone.Modules.Identity.Core.Queries.GetUsersByIds;
using SafeZone.Shared.Abstractions.Dispatchers;
using SafeZone.Shared.Abstractions.Modules;
using SafeZone.Shared.Infrastructure.Modules;

namespace SafeZone.Modules.Identity.Api;

internal sealed class IdentityModule : IModule
{
    public string Name { get; } = "Identity";
        
    public IEnumerable<string> Policies { get; } =
    [
        "identity"
    ];

    public void Register(IServiceCollection services, IConfiguration configuration)
    {
        // Optional: register core services here
        services.AddCore(configuration);
    }
        
    public void Use(IApplicationBuilder app)
    {
        // Optional: add middleware here
        app.UseModuleRequests()
            .Subscribe<GetUsersByIdsQuery, List<UserDetailsDto>>("users/get",
                (query, serviceProvider, cancellationToken) =>
                {
                    return serviceProvider.GetRequiredService<IDispatcher>().QueryAsync(query, cancellationToken);
                }
            );
    }

    public void Expose(IEndpointRouteBuilder endpoints)
    {
    }
}
