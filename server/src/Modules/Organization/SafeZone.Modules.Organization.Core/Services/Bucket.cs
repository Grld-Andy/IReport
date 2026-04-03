using Microsoft.AspNetCore.Http;

namespace SafeZone.Modules.Organization.Core.Services;

internal static class Bucket
{
    public static async Task<BucketResult> UploadFile(Guid id, string name, IFormFile file, CancellationToken cancellationToken)
    {
        if(file.Length <= 0)
        {
            throw new BadRequestException("Invalid Image");
        }
        if (!file.ContentType.StartsWith("image/"))
        {
            throw new BadRequestException("Please provide an image");
        }

        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "logos");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var extension = Path.GetExtension(file.FileName);
        var fileName = $"{id}_{name}{extension}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream, cancellationToken);

        BucketResult result = new (){Url = $"uploads/companies/{fileName}", Extension = extension};
        return result;
    }

    public class BucketResult
    {
        public string Url { get; set; } = string.Empty;
        public string Extension { get; set; } = string.Empty;
    }
}

