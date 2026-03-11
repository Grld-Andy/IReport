using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SafeZone.Shared.Abstractions.Modules;

namespace SafeZone.Modules.Activity.Api;

internal sealed class ActivityModule : IModule
{
    public string Name { get; } = "Activity";
        
    public IEnumerable<string> Policies { get; } = new[]
    {
        "activity"
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
        endpoints.MapGet("/activity/status", () =>
        {
            return Results.Ok("Activity is working");
        })
        .WithTags("Activity")
        .WithName("Get Activity Status");
    }
}
