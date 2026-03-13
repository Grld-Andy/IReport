using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using SafeZone.Shared.Abstractions;
using SafeZone.Shared.Abstractions.Dispatchers;
using SafeZone.Shared.Abstractions.Modules;
using SafeZone.Shared.Abstractions.Storage;
using SafeZone.Shared.Abstractions.Time;
using SafeZone.Shared.Infrastructure.Api;
using SafeZone.Shared.Infrastructure.Auth;
using SafeZone.Shared.Infrastructure.Commands;
using SafeZone.Shared.Infrastructure.Contexts;
using SafeZone.Shared.Infrastructure.Dispatchers;
using SafeZone.Shared.Infrastructure.Events;
using SafeZone.Shared.Infrastructure.Exceptions;
using SafeZone.Shared.Infrastructure.Kernel;
using SafeZone.Shared.Infrastructure.Logging;
using SafeZone.Shared.Infrastructure.Messaging;
using SafeZone.Shared.Infrastructure.Messaging.Outbox;
using SafeZone.Shared.Infrastructure.Modules;
using SafeZone.Shared.Infrastructure.Postgres;
using SafeZone.Shared.Infrastructure.Queries;
using SafeZone.Shared.Infrastructure.Security;
using SafeZone.Shared.Infrastructure.Serialization;
using SafeZone.Shared.Infrastructure.Services;
using SafeZone.Shared.Infrastructure.SignalR.ActivitiesHub.Clients;
using SafeZone.Shared.Infrastructure.Storage;
using SafeZone.Shared.Infrastructure.Time;

namespace SafeZone.Shared.Infrastructure;

public static class Extensions
{
    private const string CorrelationIdKey = "correlation-id";
        
    public static IServiceCollection AddInitializer<T>(this IServiceCollection services) where T : class, IInitializer
        => services.AddTransient<IInitializer, T>();
        
    public static IServiceCollection AddModularInfrastructure(this IServiceCollection services,
        IConfiguration configuration, IList<Assembly> assemblies, IList<IModule> modules)
    {
        var section = configuration.GetSection("app");
        services.Configure<AppOptions>(section);
        var appOptions = section.BindOptions<AppOptions>();
        
        var appInfo = new AppInfo(appOptions.Name, appOptions.Version);
        services.AddSingleton(appInfo);
        
        var disabledModules = new List<string>();
        foreach (var (key, value) in configuration.AsEnumerable())
        {
            if (!key.Contains(":module:enabled"))
            {
                continue;
            }

            if (!bool.Parse(value))
            {
                disabledModules.Add(key.Split(":")[0]);
            }
        }

        services.AddCorsPolicy(configuration);
        services.AddEndpointsApiExplorer();
        services.AddSignalR();
        services.AddSwaggerGen(options =>
        {
            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
            {
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                Scheme = "Bearer"
            });

            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
            });
        });
        
        services.AddMemoryCache();
        services.AddHttpClient();
        services.AddSingleton<IActivityApiClient, ActivityApiClient>();
        services.AddSingleton<IRequestStorage, RequestStorage>();
        services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        services.AddSingleton<IJsonSerializer, SystemTextJsonSerializer>();
        services.AddModuleInfo(modules);
        services.AddModuleRequests(assemblies);
        services.AddAuth(configuration, modules);
        services.AddErrorHandling();
        services.AddContext();
        services.AddCommands(assemblies);
        services.AddQueries(assemblies);
        services.AddEvents(assemblies);
        services.AddDomainEvents(assemblies);
        services.AddMessaging(configuration);
        services.AddSecurity(configuration);
        services.AddOutbox(configuration);
        services.AddPostgres(configuration);
        services.AddSingleton<IClock, UtcClock>();
        services.AddSingleton<IDispatcher, InMemoryDispatcher>();
        services.AddHostedService<DbContextAppInitializer>();
        services.AddTransactionalDecorators();
        services.AddLoggingDecorators();
        services.AddControllers()
            .ConfigureApplicationPartManager(manager =>
            {
                var removedParts = new List<ApplicationPart>();
                foreach (var disabledModule in disabledModules)
                {
                    var parts = manager.ApplicationParts.Where(x => x.Name.Contains(disabledModule,
                        StringComparison.InvariantCultureIgnoreCase));
                    removedParts.AddRange(parts);
                }

                foreach (var part in removedParts)
                {
                    manager.ApplicationParts.Remove(part);
                }
                    
                manager.FeatureProviders.Add(new InternalControllerFeatureProvider());
            });
            
        return services;
    }

    public static IApplicationBuilder UseModularInfrastructure(this IApplicationBuilder app)
    {
        app.UseForwardedHeaders(new ForwardedHeadersOptions
        {
            ForwardedHeaders = ForwardedHeaders.All
        });
        app.UseCors("cors");
        app.UseCorrelationId();
        app.UseErrorHandling();

        // var webSocketOptions = new WebSocketOptions
        // {
        //     KeepAliveInterval = TimeSpan.FromMinutes(2)
        // };
        // webSocketOptions.AllowedOrigins.Add("http://localhost:3000");
        // webSocketOptions.AllowedOrigins.Add("http://www.localhost:3000");
        // app.UseWebSockets(webSocketOptions);

        app.UseSwagger();
        app.UseSwaggerUI();
        app.UseReDoc(reDoc =>
        {
            reDoc.RoutePrefix = "docs";
            reDoc.SpecUrl("/swagger/v1/swagger.json");
            reDoc.DocumentTitle = "SafeZone API";
        });
        app.UseAuth();
        app.UseContext();
        app.UseLogging();
        app.UseRouting();
        app.UseAuthorization();

        return app;
    }

    public static T BindOptions<T>(this IConfiguration configuration, string sectionName) where T : new()
        => BindOptions<T>(configuration.GetSection(sectionName));

    public static T BindOptions<T>(this IConfigurationSection section) where T : new()
    {
        var options = new T();
        section.Bind(options);
        return options;
    }

    public static string GetModuleName(this object value)
        => value?.GetType().GetModuleName() ?? string.Empty;

    public static string GetModuleName(this Type type, string namespacePart = "Modules", int splitIndex = 2)
    {
        if (type?.Namespace is null)
        {
            return string.Empty;
        }

        return type.Namespace.Contains(namespacePart)
            ? type.Namespace.Split(".")[splitIndex].ToLowerInvariant()
            : string.Empty;
    }
        
    public static IApplicationBuilder UseCorrelationId(this IApplicationBuilder app)
        => app.Use((ctx, next) =>
        {
            ctx.Items.Add(CorrelationIdKey, Guid.NewGuid());
            return next();
        });
        
    public static Guid? TryGetCorrelationId(this HttpContext context)
        => context.Items.TryGetValue(CorrelationIdKey, out var id) ? (Guid) id : null;
}


