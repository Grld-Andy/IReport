namespace SafeZone.Modules.Incident.Core.Events.External;

internal class UserRegisteredEventHandler(IUserRepository _userRepository) : IEventHandler<UserRegisteredEvent>
{
    private readonly IUserRepository userRepository = _userRepository;

    public async Task HandleAsync(UserRegisteredEvent @event, CancellationToken cancellationToken = default)
    {
        var existingUser = await userRepository.ExistsAsync(@event.Id, cancellationToken);


        if(!existingUser)
        {
            var user = new CreateIncidentUserDto()
            {
                Name = @event.Name,
                Email = @event.Email,
                Role = @event.Role,
                CompanyId = @event.CompanyId
            };
            await userRepository.AddUserAsync(@event.Id, user, cancellationToken);
        }
    }
}