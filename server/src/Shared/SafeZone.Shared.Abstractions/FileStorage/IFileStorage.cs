using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace SafeZone.Shared.Abstractions.FileStorage;

public interface IFileStorage
{
    Task<string> UploadAsync(string objectPath, Stream content, string contentType, CancellationToken cancellationToken = default);
    Task DeleteAsync(string pathOrUrl, CancellationToken cancellationToken = default);
}
