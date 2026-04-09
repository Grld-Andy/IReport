using Microsoft.AspNetCore.Mvc;
using SafeZone.Modules.Payment.Core.Services;

namespace SafeZone.Modules.Payment.Api.Controllers;

[ApiController]
[Route("api/payments")]
public class PaymentsController(PaystackService paystackService) : ControllerBase
{
    private readonly PaystackService _paystackService = paystackService;

    [HttpPost("initialize")]
    public async Task<IActionResult> Initialize([FromBody] InitializePaymentRequest request)
    {
        var response = await _paystackService.InitializePayment(
            request.Email,
            request.Amount,
            request.Channel
        );

        return Ok(response);
    }

    [HttpGet("verify/{reference}")]
    public async Task<IActionResult> Verify(string reference)
    {
        var response = await _paystackService.VerifyPayment(reference);
        return Ok(response);
    }
}

public class InitializePaymentRequest
{
    public string Email { get; set; } = default!;
    public int Amount { get; set; }
    public string Channel { get; set; } = "mobile_money";
}