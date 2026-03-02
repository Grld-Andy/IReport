using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SafeZone.Shared.Abstractions.Modules;

namespace SafeZone.Modules.Identity.Api;

internal sealed class IdentityModule : IModule
{
    public string Name { get; } = "Identity";
        
    public IEnumerable<string> Policies { get; } = new[]
    {
        "identity"
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
        // Simple GET endpoint
        endpoints.MapGet("/identity/status", () =>
        {
            return Results.Ok("Identity is working");
        })
        .WithTags("Identity")
        .WithName("Get Identity Status");
    }
}
