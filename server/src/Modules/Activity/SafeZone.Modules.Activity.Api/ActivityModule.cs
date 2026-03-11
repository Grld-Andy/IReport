using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SafeZone.Modules.Activity.Core.Commands.CreateActivity;
using SafeZone.Modules.Activity.Core.Domain.Entities;
using SafeZone.Shared.Abstractions.Dispatchers;
using SafeZone.Shared.Abstractions.Modules;
using SafeZone.Shared.Infrastructure.Modules;

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
        app.UseModuleRequests()
            .Subscribe<CreateActivityCommand>("activities/post", 
                (command, serviceProvider, cancellationToken) =>
                {
                    return serviceProvider.GetRequiredService<IDispatcher>().SendAsync<CreateActivityCommand, ActivityEntity>(command, cancellationToken);
                }
            );
    }

    public void Expose(IEndpointRouteBuilder endpoints)
    {
    }
}
