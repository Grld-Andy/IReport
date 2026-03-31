using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SafeZone.Modules.Media.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
internal class MediaController : ControllerBase
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

        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var safeFileName = Path.GetFileName(file.FileName);
        var fileName = $"{Guid.NewGuid()}_{safeFileName}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        return Ok(new { Url = $"/uploads/{fileName}" });
    }
}