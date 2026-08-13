using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using SafeZone.Shared.Abstractions.Exceptions.ExceptionClasses;
using SafeZone.Shared.Abstractions.FileStorage;

namespace SafeZone.Shared.Infrastructure.FileStorage;

internal sealed class SupabaseFileStorage : IFileStorage
{
    private static readonly SemaphoreSlim BucketLock = new(1, 1);
    private static bool _bucketReady;

    private readonly HttpClient _http;
    private readonly SupabaseOptions _options;

    public SupabaseFileStorage(HttpClient http, IOptions<SupabaseOptions> options)
    {
        _options = options.Value;
        _http = http;
        if (!string.IsNullOrWhiteSpace(_options.Url))
        {
            _http.BaseAddress = new Uri(NormalizeUrl(_options.Url));
            _http.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _options.ServiceRoleKey);
            _http.DefaultRequestHeaders.TryAddWithoutValidation("apikey", _options.ServiceRoleKey);
        }
    }

    public async Task<string> UploadAsync(string objectPath, Stream content, string contentType, CancellationToken cancellationToken = default)
    {
        EnsureConfigured();
        await EnsureBucketAsync(cancellationToken);

        var path = objectPath.TrimStart('/');
        using var contentStream = new StreamContent(content);
        contentStream.Headers.ContentType = new MediaTypeHeaderValue(string.IsNullOrWhiteSpace(contentType) ? "application/octet-stream" : contentType);

        using var request = new HttpRequestMessage(HttpMethod.Post, $"storage/v1/object/{_options.Bucket}/{path}")
        {
            Content = contentStream
        };
        request.Headers.TryAddWithoutValidation("x-upsert", "true");

        using var response = await _http.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new BadRequestException($"Failed to upload image to storage: {response.StatusCode} {body}");
        }

        return $"{NormalizeUrl(_options.Url)}storage/v1/object/public/{_options.Bucket}/{path}";
    }

    public async Task DeleteAsync(string pathOrUrl, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(pathOrUrl) || !pathOrUrl.Contains("supabase", StringComparison.OrdinalIgnoreCase))
        {
            return;
        }

        EnsureConfigured();

        var marker = $"/object/public/{_options.Bucket}/";
        var index = pathOrUrl.IndexOf(marker, StringComparison.OrdinalIgnoreCase);
        if (index < 0)
        {
            return;
        }

        var path = pathOrUrl[(index + marker.Length)..];
        using var response = await _http.DeleteAsync($"storage/v1/object/{_options.Bucket}/{path}", cancellationToken);
        if (!response.IsSuccessStatusCode && response.StatusCode != System.Net.HttpStatusCode.NotFound)
        {
            var body = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new BadRequestException($"Failed to delete image from storage: {response.StatusCode} {body}");
        }
    }

    private async Task EnsureBucketAsync(CancellationToken cancellationToken)
    {
        if (_bucketReady)
        {
            return;
        }

        await BucketLock.WaitAsync(cancellationToken);
        try
        {
            if (_bucketReady)
            {
                return;
            }

            var payload = JsonSerializer.Serialize(new
            {
                id = _options.Bucket,
                name = _options.Bucket,
                @public = true,
                file_size_limit = 5 * 1024 * 1024
            });

            using var content = new StringContent(payload, Encoding.UTF8, "application/json");
            using var response = await _http.PostAsync("storage/v1/bucket", content, cancellationToken);
            if (!response.IsSuccessStatusCode && response.StatusCode != System.Net.HttpStatusCode.Conflict)
            {
                var body = await response.Content.ReadAsStringAsync(cancellationToken);
                if (!body.Contains("already exists", StringComparison.OrdinalIgnoreCase))
                {
                    throw new BadRequestException($"Failed to create storage bucket '{_options.Bucket}': {response.StatusCode} {body}");
                }
            }

            _bucketReady = true;
        }
        finally
        {
            BucketLock.Release();
        }
    }

    private void EnsureConfigured()
    {
        if (string.IsNullOrWhiteSpace(_options.Url) || string.IsNullOrWhiteSpace(_options.ServiceRoleKey))
        {
            throw new BadRequestException("Supabase storage is not configured. Set supabase__url and supabase__serviceRoleKey.");
        }
    }

    private static string NormalizeUrl(string url)
        => string.IsNullOrWhiteSpace(url) ? url : url.TrimEnd('/') + "/";
}
