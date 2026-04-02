using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SafeZone.Modules.Payment.Core;
using SafeZone.Shared.Abstractions.Modules;

namespace SafeZone.Modules.Payment.Api;

internal sealed class PaymentModule : IModule
{
    public string Name { get; } = "Payment";
        
    public IEnumerable<string> Policies { get; } = new[]
    {
        "payment"
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
        endpoints.MapGet("/payment/status", () =>
        {
            return Results.Ok("Payment is working");
        })
        .WithTags("Payment")
        .WithName("Get Payment Status");
    }
}
