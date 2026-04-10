using Microsoft.AspNetCore.Mvc;
using SafeZone.Modules.Payments.Core.Commands.InitPayment;
using SafeZone.Modules.Payments.Core.DTO;
using SafeZone.Modules.Payments.Core.Queries.VerifyPayment;
using SafeZone.Shared.Abstractions.Dispatchers;

namespace SafeZone.Modules.Payments.Api.Controllers;

[ApiController]
[Route("api/payments")]
internal class PaymentsController(IDispatcher _dispatcher) : ControllerBase
{
    private readonly IDispatcher dispatcher = _dispatcher;

    [HttpPost("initialize")]
    public async Task<ActionResult<InitializePaymentResponse>> Initialize([FromBody] InitializePaymentRequest request, CancellationToken cancellationToken)
    {
        var response = await dispatcher.SendAsync<InitPaymentCommand, InitializePaymentResponse>(new InitPaymentCommand(request), cancellationToken);
        return Ok(response);
    }

    [HttpGet("verify/{reference}")]
    public async Task<ActionResult<VerifyPaymentResponse>> Verify(string reference, CancellationToken cancellationToken)
    {
        var response = await dispatcher.QueryAsync(new VerifyPaymentQuery(reference), cancellationToken);
        return Ok(response);
    }
}
