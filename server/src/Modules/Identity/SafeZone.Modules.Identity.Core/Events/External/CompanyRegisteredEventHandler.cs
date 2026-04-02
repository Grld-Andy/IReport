using SafeZone.Modules.Identity.Core.Commands.CreateUserCompany;
using SafeZone.Modules.Identity.Core.Commands.Register;
using SafeZone.Shared.Abstractions.Dispatchers;
using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Modules.Identity.Core.Events.External;

internal class CompanyRegisteredEventHandler(IDispatcher _dispatcher) : IEventHandler<CompanyRegisteredEvent>
{
    private readonly IDispatcher dispatcher = _dispatcher;

    public async Task HandleAsync(CompanyRegisteredEvent @event, CancellationToken cancellationToken = default)
    {
        Console.WriteLine("Calling company Registered Event Handler");
        var user = new UserCreateDto
        {
            Name = @event.AdminName,
            Email = @event.Email,
            Role = "admin",
            Team = "Admin",
            PhoneNumber = @event.PhoneNumber,
            OTP = ""
        };
        var company = Company.AddCompany(@event.CompanyId, @event.CompanyName, @event.Extension);
        await dispatcher.SendAsync(new RegisterCommand(user), cancellationToken);
        await dispatcher.SendAsync(new CreateUserCompanyCommand(company), cancellationToken);
    }
}