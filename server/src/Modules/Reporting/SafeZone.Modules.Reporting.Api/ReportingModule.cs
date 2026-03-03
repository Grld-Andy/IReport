using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SafeZone.Shared.Abstractions.Modules;

namespace SafeZone.Modules.Reporting.Api;

internal sealed class ReportingModule : IModule
{
    public string Name { get; } = "Reporting";
        
    public IEnumerable<string> Policies { get; } = new[]
    {
        "reporting"
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
        endpoints.MapGet("/reporting/status", () =>
        {
            return Results.Ok("Reporting is working");
        })
        .WithTags("Reporting")
        .WithName("Get Reporting Status");
    }
}
