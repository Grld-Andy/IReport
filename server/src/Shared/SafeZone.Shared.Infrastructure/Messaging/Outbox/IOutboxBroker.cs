using System.Threading.Tasks;
using SafeZone.Shared.Abstractions.Messaging;

namespace SafeZone.Shared.Infrastructure.Messaging.Outbox;

public interface IOutboxBroker
{
    bool Enabled { get; }
    Task SendAsync(params IMessage[] messages);
}


