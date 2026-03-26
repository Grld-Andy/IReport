using System;
using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Shared.Infrastructure.SignalR.UsersHub.UserUpdated;

internal record UserUpdatedEvent(UserDetailsDto User) : IEvent;

internal class UserDetailsDto : UserDto{
    public Guid Id { get; set; } = default;
    public DateTime CreatedAt { get; set; } = default;
    public DateTime UpdatedAt { get;  set; } = default;
    public string Status { get;  set; } = default!;
}

internal class UserDto{
    public string Name { get;  set; } = default!;
    public string Email { get; set; } = default!;
    public string Role { get; set; } = default!;
    public string Team { get; set; } = default!;
}