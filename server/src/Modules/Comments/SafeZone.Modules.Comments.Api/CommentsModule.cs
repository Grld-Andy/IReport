using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SafeZone.Shared.Abstractions.Modules;

namespace SafeZone.Modules.Comments.Api;

internal sealed class CommentsModule : IModule
{
    public string Name { get; } = "Comments";
        
    public IEnumerable<string> Policies { get; } = new[]
    {
        "comments"
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
        // endpoints.MapGet("/comments/status", () =>
        // {
        //     return Results.Ok("Comments is working");
        // })
        // .WithTags("Comments")
        // .WithName("Get Comments Status");
    }
}
