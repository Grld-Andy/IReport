using Microsoft.AspNetCore.Http;

namespace SafeZone.Modules.Organization.Core.Services;

internal static class Bucket
{
    public static async Task<string> UploadFile(IFormFile file, CancellationToken cancellationToken)
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

        var safeFileName = Path.GetFileName(file.FileName);
        var fileName = $"{Guid.NewGuid()}_{safeFileName}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream, cancellationToken);

        return $"uploads/logos/{fileName}";
    }
}