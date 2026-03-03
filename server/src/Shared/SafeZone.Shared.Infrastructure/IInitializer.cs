using System.Threading.Tasks;

namespace SafeZone.Shared.Infrastructure;

public interface IInitializer
{
    Task InitAsync();
}


