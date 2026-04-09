using System;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace SafeZone.Shared.Infrastructure.Security;

public static class RateLimiting
{
    public static IServiceCollection AddFixedRateLimiter(this IServiceCollection services, IConfiguration configuration)
    {
        int permitLimit = int.TryParse(configuration["rateLimiter:permitLimit"], out var permitValue) ? permitValue : 5;
        int window = int.TryParse(configuration["rateLimiter:window"], out var windowValue) ? windowValue : 5;

        Console.WriteLine($"======================== Rate limter activated: {permitLimit} {window}");
        services.AddRateLimiter(options =>{ 
            options.AddFixedWindowLimiter("fixed", options =>
            {
                options.PermitLimit = permitLimit;
                options.Window = TimeSpan.FromMinutes(window);
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