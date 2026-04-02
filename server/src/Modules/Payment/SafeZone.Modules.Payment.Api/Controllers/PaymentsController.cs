using Microsoft.AspNetCore.Mvc;

namespace SafeZone.Modules.Payment.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
internal class PaymentsController : ControllerBase
{
    [HttpPost("initiate-payment")]
    public async Task<IActionResult> InitiatePayment()
    {
        return Ok();
    }
}