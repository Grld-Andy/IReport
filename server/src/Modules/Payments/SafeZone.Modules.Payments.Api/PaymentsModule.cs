using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Safezone.Modules.Payments.Core;
using SafeZone.Shared.Abstractions.Modules;

namespace SafeZone.Modules.Payments.Api;

internal sealed class PaymentsModule : IModule
{
    public string Name { get; } = "Payments";
        
    public IEnumerable<string> Policies { get; } = new[]
    {
        "payments"
    };

    public void Register(IServiceCollection services, IConfiguration configuration)
    {
        services.AddCore(configuration);
    }
        
    public void Use(IApplicationBuilder app)
    {
        // Optional: add middleware here
    }

    public void Expose(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/payments/status", () =>
        {
            return Results.Ok("Payments is working");
        })
        .WithTags("Payments")
        .WithName("Get Payments Status");
    }
}
