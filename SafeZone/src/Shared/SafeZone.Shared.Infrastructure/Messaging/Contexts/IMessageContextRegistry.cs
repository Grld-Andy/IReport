using SafeZone.Shared.Abstractions.Messaging;

namespace SafeZone.Shared.Infrastructure.Messaging.Contexts;

public interface IMessageContextRegistry
{
    void Set(IMessage message, IMessageContext context);
}


