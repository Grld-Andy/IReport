using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http;
using SafeZone.Shared.Abstractions.FileStorage;

namespace SafeZone.Modules.Organization.Core.Services;

internal sealed class Bucket(IFileStorage fileStorage)
{
    private readonly IFileStorage _fileStorage = fileStorage;

    public async Task<BucketResult> UploadFile(
        Guid id,
        string name,
        IFormFile file,
        string? oldUrl,
        CancellationToken cancellationToken = default
    )
    {
        if (file.Length <= 0)
        {
            throw new BadRequestException("Invalid Image");
        }

        if (!file.ContentType.StartsWith("image/"))
        {
            throw new BadRequestException("Please provide an image");
        }

        var extension = Path.GetExtension(file.FileName);
        var newFileName = $"{id}_{Sanitize(name)}{extension}";
        var objectPath = $"companies/{newFileName}";

        await using var stream = file.OpenReadStream();
        var url = await _fileStorage.UploadAsync(objectPath, stream, file.ContentType, cancellationToken);

        if (!string.IsNullOrWhiteSpace(oldUrl) && !string.Equals(oldUrl, url, StringComparison.OrdinalIgnoreCase))
        {
            await _fileStorage.DeleteAsync(oldUrl, cancellationToken);
        }

        return new BucketResult
        {
            Url = url,
            Extension = extension
        };
    }

    private static string Sanitize(string name)
    {
        var cleaned = Regex.Replace(name ?? string.Empty, @"[^\w\-]+", "_");
        return cleaned.Length > 50 ? cleaned[..50] : cleaned;
    }

    public class BucketResult
    {
        public string Url { get; set; } = string.Empty;
        public string Extension { get; set; } = string.Empty;
    }
}
