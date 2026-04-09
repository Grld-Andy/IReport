using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;

namespace SafeZone.Modules.Payment.Core.Services;

public class PaystackService
{
    private readonly HttpClient _client;
    private readonly IConfiguration _config;

    public PaystackService(HttpClient client, IConfiguration config)
    {
        _client = client;
        _config = config;

        _client.BaseAddress = new Uri(_config["paystack:baseUrl"]!);
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _config["paystack:secretKey"]);
    }

    public async Task<string> InitializePayment(string email, int amount, string channel)
    {
        var payload = new
        {
            email,
            amount = amount * 100,
            currency = "GHS",
            channels = new[] { channel },
            callback_url = "http://localhost:5173/success"
        };

        var content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");

        var response = await _client.PostAsync("/transaction/initialize", content);
        Console.WriteLine($"================ {response}");

        // save to database with status as pending
        // _db.Payments.Add(payment);
        return await response.Content.ReadAsStringAsync();
    }

    public async Task<string> VerifyPayment(string reference)
    {
        var response = await _client.GetAsync($"/transaction/verify/{reference}");
        return await response.Content.ReadAsStringAsync();
    }
}