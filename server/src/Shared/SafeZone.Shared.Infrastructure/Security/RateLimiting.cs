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
    public static IServiceCollection FixedRateLimiter(this IServiceCollection services, IConfiguration configuration)
    {
        int permitLimit = int.TryParse(configuration["rateLimiter:permitLimit"], out var permitValue) ? permitValue : 5;
        int window = int.TryParse(configuration["rateLimiter:window"], out var windowValue) ? windowValue : 5;

        Console.WriteLine($"======================== Rate limter activated: {permitLimit} {window}");
        services.AddRateLimiter(options =>{ 
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            options.AddFixedWindowLimiter("fixed", options =>
            {
                options.PermitLimit = permitLimit;
                options.Window = TimeSpan.FromMinutes(window);
                options.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
                options.QueueLimit = 0;
            });
        });
        return services;
    }
}