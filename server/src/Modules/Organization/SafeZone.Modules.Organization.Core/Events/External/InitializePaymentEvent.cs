using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Modules.Organization.Core.Events.External;

internal record InitializePaymentEvent(string Email, decimal Amount, List<string>? Channels) : IEvent;