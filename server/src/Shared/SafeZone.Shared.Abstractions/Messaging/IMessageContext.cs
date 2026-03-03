using System;
using SafeZone.Shared.Abstractions.Contexts;

namespace SafeZone.Shared.Abstractions.Messaging;

public interface IMessageContext
{
    public Guid MessageId { get; }
    public IContext Context { get; }
}


