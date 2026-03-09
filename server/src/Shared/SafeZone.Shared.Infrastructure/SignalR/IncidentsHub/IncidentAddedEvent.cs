using System;
using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Shared.Infrastructure.SignalR.IncidentsHub;

public record IncidentAddedEvent(Guid Id, string Title, string Status) : IEvent;