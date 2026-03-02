using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SafeZone.Shared.Abstractions.Modules;

namespace SafeZone.Modules.Location.Api;

internal sealed class LocationModule : IModule
{
    public string Name { get; } = "Location";
        
    public IEnumerable<string> Policies { get; } = new[]
    {
        "location"
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
        endpoints.MapGet("/location/status", () =>
        {
            return Results.Ok("Location is working");
        })
        .WithTags("Location")
        .WithName("Get Location Status");
    }
}
