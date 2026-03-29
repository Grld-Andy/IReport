using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SafeZone.Shared.Abstractions.Modules;
using SafeZone.Modules.Notifications.Core;

namespace SafeZone.Modules.Notifications.Api;

internal sealed class NotificationsModule : IModule
{
    public string Name { get; } = "Notifications";
        
    public IEnumerable<string> Policies { get; } = new[]
    {
        "notifications"
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
        endpoints.MapGet("/notifications/status", () =>
        {
            return Results.Ok("Notifications is working");
        })
        .WithTags("Notifications")
        .WithName("Get Notifications Status");
    }
}
