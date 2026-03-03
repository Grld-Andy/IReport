using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SafeZone.Shared.Abstractions.Modules;

namespace SafeZone.Modules.Dispatch.Api;

internal sealed class DispatchModule : IModule
{
    public string Name { get; } = "Dispatch";
        
    public IEnumerable<string> Policies { get; } = new[]
    {
        "dispatch"
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
        endpoints.MapGet("/dispatch/status", () =>
        {
            return Results.Ok("Dispatch is working");
        })
        .WithTags("Dispatch")
        .WithName("Get Dispatch Status");
    }
}
