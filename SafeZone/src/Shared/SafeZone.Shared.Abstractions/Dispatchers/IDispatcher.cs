using System.Threading;
using System.Threading.Tasks;
using SafeZone.Shared.Abstractions.Commands;
using SafeZone.Shared.Abstractions.Events;
using SafeZone.Shared.Abstractions.Queries;

namespace SafeZone.Shared.Abstractions.Dispatchers;

public interface IDispatcher
{
    Task SendAsync<T>(T command, CancellationToken cancellationToken = default) where T : class, ICommand;
    Task PublishAsync<T>(T @event, CancellationToken cancellationToken = default) where T : class, IEvent;
    Task<TResult> QueryAsync<TResult>(IQuery<TResult> query, CancellationToken cancellationToken = default);
}


