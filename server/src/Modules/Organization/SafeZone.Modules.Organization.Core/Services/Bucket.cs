using Microsoft.AspNetCore.Http;

namespace SafeZone.Modules.Organization.Core.Services;

internal static class Bucket
{
    public static async Task<BucketResult> UploadFile(
        Guid id,
        string name,
        IFormFile file,
        string? oldName,
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

        var uploadsFolder = Path.Combine(
            Directory.GetCurrentDirectory(),
            "wwwroot",
            "uploads",
            "companies"
        );

        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var extension = Path.GetExtension(file.FileName);
        var newFileName = $"{id}_{name}{extension}";
        var newFilePath = Path.Combine(uploadsFolder, newFileName);

        DeleteOldFileIfChanged(uploadsFolder, oldName, newFileName);

        using var stream = new FileStream(newFilePath, FileMode.Create);
        await file.CopyToAsync(stream, cancellationToken);

        return new BucketResult
        {
            Url = $"uploads/companies/{newFileName}",
            Extension = extension
        };
    }

    private static void DeleteOldFileIfChanged(string uploadsFolder, string? oldName, string newFileName)
    {
        if (string.IsNullOrWhiteSpace(oldName))
            return;

        var oldFileName = Path.GetFileName(oldName);

        if (string.Equals(oldFileName, newFileName, StringComparison.OrdinalIgnoreCase))
            return;

        var oldFilePath = Path.Combine(uploadsFolder, oldFileName);

        try
        {
            if (File.Exists(oldFilePath))
            {
                File.Delete(oldFilePath);
            }
        }catch{}
    }

    public class BucketResult
    {
        public string Url { get; set; } = string.Empty;
        public string Extension { get; set; } = string.Empty;
    }
}

