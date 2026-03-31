using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SafeZone.Shared.Abstractions.Modules;

namespace SafeZone.Modules.Media.Api;

internal sealed class MediaModule : IModule
{
    public string Name { get; } = "Media";
        
    public IEnumerable<string> Policies { get; } = new[]
    {
        "media"
    };

    public void Register(IServiceCollection services, IConfiguration configuration)
    {
        // Optional: register core services here
    }
        
    public void Use(IApplicationBuilder app)
    {
        // Optional: add middleware here
    }

    public void Expose(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/media/status", () =>
        {
            return Results.Ok("Media is working");
        })
        .WithTags("Media")
        .WithName("Get Media Status");
    }
}
