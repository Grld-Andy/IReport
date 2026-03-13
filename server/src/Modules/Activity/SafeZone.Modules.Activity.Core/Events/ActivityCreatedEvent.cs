using SafeZone.Modules.Activity.Core.Domain.Entities;
using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Modules.Activity.Core.Events;

internal record ActivityCreatedEvent(ActivityEntity Activity) : IEvent;