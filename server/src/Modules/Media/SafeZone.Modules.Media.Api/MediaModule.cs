using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SafeZone.Modules.Media.Core;
using SafeZone.Shared.Abstractions.Modules;

namespace SafeZone.Modules.Media.Api;

internal sealed class MediaModule : IModule
{
    public string Name { get; } = "Media";
        
    public IEnumerable<string> Policies { get; } =
    [
        "media"
    ];

    public void Register(IServiceCollection services, IConfiguration configuration)
    {
        services.AddCore(configuration);
    }
        
    public void Use(IApplicationBuilder app)
    {
        app.UseStaticFiles();
    }

    public void Expose(IEndpointRouteBuilder endpoints)
    {
    }
}
