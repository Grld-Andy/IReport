using System;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace SafeZone.Shared.Infrastructure.Security;

public static class RateLimiting
{
    public static IServiceCollection AddFixedRateLimiter(this IServiceCollection services, IConfiguration configuration)
    {
        int permitLimit = int.TryParse(configuration["rateLimiter:permitLimit"], out var permitValue) ? permitValue : 5;
        int window = int.TryParse(configuration["rateLimiter:window"], out var windowValue) ? windowValue : 5;

        services.AddRateLimiter(options =>{
            options.AddPolicy("fixed", context =>
            {
                var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = permitLimit,
                    Window = TimeSpan.FromMinutes(window)
                });
            });

            options.OnRejected = async (context, token) =>
            {
                context.HttpContext.Response.StatusCode = 429;
                await context.HttpContext.Response.WriteAsync("Rate limit exceeded!", token);
            };
        });
        return services;
    }
}