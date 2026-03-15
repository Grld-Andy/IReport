using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using SafeZone.Shared.Abstractions;
using SafeZone.Shared.Infrastructure;
using SafeZone.Shared.Infrastructure.Logging;
using SafeZone.Shared.Infrastructure.Modules;
using SafeZone.Shared.Infrastructure.SignalR.ActivitiesHub;
using SafeZone.Shared.Infrastructure.SignalR.IncidentsHub;
using SafeZone.Shared.Infrastructure.SignalR.LocationsHub;

var builder = WebApplication
    .CreateBuilder(args);

builder.Host.ConfigureModules().UseLogging();

var assemblies = ModuleLoader.LoadAssemblies(builder.Configuration, "SafeZone.Modules.");
var modules = ModuleLoader.LoadModules(assemblies);

builder.Services.AddModularInfrastructure(builder.Configuration, assemblies, modules);

foreach (var module in modules)
{
    module.Register(builder.Services, builder.Configuration);
}

var app = builder.Build();

app.MapControllers();
app.UseModularInfrastructure();

foreach (var module in modules)
{
    module.Use(app);
}

app.MapGet("/", (AppInfo appInfo) => appInfo).WithTags("API").WithName("Info");

app.MapGet("/ping", () => "pong").WithTags("API").WithName("Pong");

app.MapGet("/modules", (ModuleInfoProvider moduleInfoProvider) => moduleInfoProvider.Modules);

foreach (var module in modules)
{
    module.Expose(app);
}
app.MapHub<IncidentHub>("/Incidents");
app.MapHub<ActivityHub>("/Activities");
app.MapHub<LocationHub>("/Locations");

assemblies.Clear();
modules.Clear();

app.Run();
