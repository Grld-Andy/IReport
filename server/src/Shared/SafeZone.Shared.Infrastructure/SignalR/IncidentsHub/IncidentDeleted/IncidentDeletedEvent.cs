using System;
using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Shared.Infrastructure.SignalR.IncidentsHub.IncidentDeleted;

internal record IncidentDeletedEvent(Guid Id) : IEvent;