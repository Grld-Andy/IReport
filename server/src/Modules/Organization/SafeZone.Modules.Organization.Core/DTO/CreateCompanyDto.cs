namespace SafeZone.Modules.Organization.Core.DTO;

internal class CreateCompanyDto : CompanyDto
{
    public string Email { get; set; } = default!;
    public string Password { get; set; } = default!;
    public string AdminName { get; set; } = default!;
    public string PhoneNumber { get; set; } = default!;
    public string PaymentRef { get; set; } = default!;
}
