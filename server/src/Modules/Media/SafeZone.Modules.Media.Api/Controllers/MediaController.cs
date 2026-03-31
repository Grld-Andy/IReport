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
        if(file.Length <= 0)
        {
            return BadRequest("Invalid file");
        }

        if(!file.ContentType.StartsWith("image/")){
            return BadRequest("Only images are allowed");
        }

        var filePath = Path.Combine("Uploads", file.FileName);
        using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        return Ok(new { FilePath = filePath });
    }
}