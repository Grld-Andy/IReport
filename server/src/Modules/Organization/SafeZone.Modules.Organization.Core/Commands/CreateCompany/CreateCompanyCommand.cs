namespace SafeZone.Modules.Organization.Core.Commands.CreateCompany;

internal record CreateCompanyCommand(CreateCompanyDto Company) : ICommand;