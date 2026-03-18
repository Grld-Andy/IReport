namespace SafeZone.Modules.Incident.Core.Events.External;

internal class UserRegisteredHandler(IUserRepository _userRepository) : IEventHandler<UserRegistered>
{
    private readonly IUserRepository userRepository = _userRepository;

    public async Task HandleAsync(UserRegistered @event, CancellationToken cancellationToken = default)
    {
        var existingUser = await userRepository.ExistsAsync(@event.Id, cancellationToken);

        if(!existingUser)
        {
            var user = new CreateIncidentUserDto()
            {
                Name = @event.Name,
                Email = @event.Email,
                Role = @event.Role
            };
            await userRepository.AddUserAsync(@event.Id, user, cancellationToken);
        }
        System.Console.WriteLine("===================== Created incident user successfull");
    }
}