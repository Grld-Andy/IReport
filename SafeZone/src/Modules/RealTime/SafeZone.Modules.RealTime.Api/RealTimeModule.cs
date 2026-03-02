using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SafeZone.Shared.Abstractions.Modules;

namespace SafeZone.Modules.RealTime.Api;

internal sealed class RealTimeModule : IModule
{
    public string Name { get; } = "RealTime";
        
    public IEnumerable<string> Policies { get; } = new[]
    {
        "realtime"
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
        endpoints.MapGet("/realtime/status", () =>
        {
            return Results.Ok("RealTime is working");
        })
        .WithTags("RealTime")
        .WithName("Get RealTime Status");
    }
}
