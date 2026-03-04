using SafeZone.Shared.Abstractions.Messaging;

namespace SafeZone.Shared.Abstractions.Commands;

//Marker
public interface ICommand : IMessage
{
}

public interface ICommand<T> : IMessage
{
}
