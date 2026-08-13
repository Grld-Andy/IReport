using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SafeZone.Shared.Abstractions.FileStorage;

namespace SafeZone.Modules.Media.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
internal class MediaController(IFileStorage fileStorage) : ControllerBase
{
    [HttpPost("upload")]
    public async Task<ActionResult> UploadFile(IFormFile file)
    {
        if (file.Length <= 0)
        {
            return BadRequest("Invalid file");
        }

        if (!file.ContentType.StartsWith("image/"))
        {
            return BadRequest("Only images are allowed");
        }

        var extension = Path.GetExtension(file.FileName);
        var fileName = $"{Guid.NewGuid()}{extension}";
        await using var stream = file.OpenReadStream();
        var url = await fileStorage.UploadAsync($"media/{fileName}", stream, file.ContentType);

        return Ok(new { Url = url });
    }
}
