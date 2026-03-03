using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SafeZone.Shared.Abstractions.Modules;

namespace SafeZone.Modules.Incident.Api;

internal sealed class IncidentModule : IModule
{
    public string Name { get; } = "Incident";
        
    public IEnumerable<string> Policies { get; } = new[]
    {
        "incident"
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
        endpoints.MapGet("/incident/status", () =>
        {
            return Results.Ok("Incident is working");
        })
        .WithTags("Incident")
        .WithName("Get Incident Status");
    }
}
