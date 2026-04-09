using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Security.Cryptography;
using System.Text;

namespace SafeZone.Modules.Payments.Api.Controllers;

[ApiController]
[Route("api/payments/webhook")]
public class PaystackWebhookController(IConfiguration config) : ControllerBase
{
    private readonly IConfiguration _config = config;

    [HttpPost]
    public async Task<IActionResult> HandleWebhook()
    {
        var json = await new StreamReader(Request.Body).ReadToEndAsync();

        dynamic data = JsonConvert.DeserializeObject(json)!;

        if (data.@event != "charge.success")
            return Ok();

        string reference = data.data.reference;

        // var payment = await _db.Payments
        //     .FirstOrDefaultAsync(p => p.Reference == reference);

        // if (payment == null)
        //     return Ok(); // unknown payment, ignore safely

        // 🔥 Idempotency check
        // if (payment.Status == "success")
        // {
        //     return Ok(); // already processed → ignore duplicate
        // }

        // payment.Status = "success";
        // payment.PaidAt = DateTime.UtcNow;
        // payment.RawResponse = json;

        // await _db.SaveChangesAsync();

        // TODO: trigger business logic (e.g. unlock service)

        return Ok();
    }

    // [HttpPost]
    // public async Task<IActionResult> HandleWebhook()
    // {
    //     var json = await new StreamReader(Request.Body).ReadToEndAsync();

    //     Console.WriteLine("🔥 WEBHOOK HIT");
    //     Console.WriteLine(json);

    //     var secret = _config["paystack:secretKey"];
    //     var hash = Request.Headers["x-paystack-signature"];

    //     using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(secret!));
    //     var computedHash = BitConverter.ToString(
    //         hmac.ComputeHash(Encoding.UTF8.GetBytes(json))
    //     ).Replace("-", "").ToLower();

    //     if (computedHash != hash)
    //     {
    //         Console.WriteLine("❌ Invalid signature");
    //         return Unauthorized();
    //     }

    //     dynamic data = Newtonsoft.Json.JsonConvert.DeserializeObject(json)!;

    //     string eventType = data.@event;
    //     Console.WriteLine($"Event: {eventType}");

    //     if (eventType == "charge.success")
    //     {
    //         string reference = data.data.reference;
    //         Console.WriteLine($"✅ Payment success: {reference}");

    //         // TODO: update DB
    //     }

    //     return Ok();
    // }
}