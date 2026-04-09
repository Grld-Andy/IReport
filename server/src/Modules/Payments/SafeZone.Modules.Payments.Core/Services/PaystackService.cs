using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Http;

namespace SafeZone.Modules.Payments.Core.Services;

internal class PaystackService
{
    private readonly HttpClient client;
    private readonly IConfiguration config;

    public PaystackService(HttpClient _client, IConfiguration _config)
    {
        client = _client;
        config = _config;

        _client.BaseAddress = new Uri(config["paystack:baseUrl"]!);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", config["paystack:secretKey"]);
    }

    public async Task<InitializePaymentResponse> InitializePayment(InitializePaymentRequest request)
    {
        var payload = new { 
            amount = request.Amount,
            email = request.Email,
            channels = request.Channels is not null ? request.Channels : ["card", "bank", "apple_pay", "ussd", "qr", "mobile_money", "bank_transfer"],
            // callback_url = "http://localhost:5173/success"
        };
        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        var httpResponse = await client.PostAsync("/transaction/initialize", content);
        var responseContent = await httpResponse.Content.ReadAsStringAsync();
        Console.WriteLine($"=============== {responseContent}");

        var response = JsonSerializer.Deserialize<InitializePaymentResponse>(responseContent);
        return response!;
    }

    public async Task<string> VerifyPaymentService(string reference)
    {
        var httpResponse = await client.GetAsync($"/transaction/verify/{reference}");
        var responseContent = await httpResponse.Content.ReadAsStringAsync();
        return responseContent;
    }
}