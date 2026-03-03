using System;
using System.Threading.Tasks;

namespace SafeZone.Shared.Infrastructure.Postgres;

public interface IUnitOfWork
{
    Task ExecuteAsync(Func<Task> action);
}


