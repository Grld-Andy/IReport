using System.Text;
using System.Text.Json;

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
            amount = 500 * 100,
            email = request.Email,
            channels = request.Channels?.Count == 0 ? request.Channels : ["card", "mobile_money", "bank_transfer"],
        };
        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        var httpResponse = await client.PostAsync("/transaction/initialize", content);
        var responseContent = await httpResponse.Content.ReadAsStringAsync();

        var response = JsonSerializer.Deserialize<InitializePaymentResponse>(responseContent);
        return response!;
    }

    public async Task<string> VerifyPaymentService(string reference)
    {
        var httpResponse = await client.GetAsync($"/transaction/verify/{reference}");
        var responseContent = await httpResponse.Content.ReadAsStringAsync();
        Console.WriteLine($"@@@@@@@@@@@@@@@@@@@ respone from verificaiton is {responseContent}");
        return responseContent;
    }
}