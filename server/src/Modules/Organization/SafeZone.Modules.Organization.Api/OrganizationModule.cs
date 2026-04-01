using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SafeZone.Shared.Abstractions.Modules;

namespace SafeZone.Modules.Organization.Api;

internal sealed class OrganizationModule : IModule
{
    public string Name { get; } = "Organization";
        
    public IEnumerable<string> Policies { get; } = new[]
    {
        "organization"
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
        endpoints.MapGet("/organization/status", () =>
        {
            return Results.Ok("Organization is working");
        })
        .WithTags("Organization")
        .WithName("Get Organization Status");
    }
}
