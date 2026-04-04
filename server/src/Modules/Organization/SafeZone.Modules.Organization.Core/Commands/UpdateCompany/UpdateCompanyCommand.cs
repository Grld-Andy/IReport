using Microsoft.AspNetCore.Http;

namespace SafeZone.Modules.Organization.Core.Commands.UpdateCompany;

internal record UpdateCompanyCommand(Guid Id, string Name, IFormFile Logo) : ICommand;