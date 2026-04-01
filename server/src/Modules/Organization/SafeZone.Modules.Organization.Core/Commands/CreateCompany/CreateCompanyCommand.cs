using Microsoft.AspNetCore.Http;

namespace SafeZone.Modules.Organization.Core.Commands.CreateCompany;

internal record CreateCompanyCommand(string Name, IFormFile Logo) : ICommand;