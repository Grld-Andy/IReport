using SafeZone.Modules.Organization.Core.DAL.Repositories;
using SafeZone.Modules.Organization.Core.Events;
using SafeZone.Shared.Abstractions.Messaging;

namespace SafeZone.Modules.Organization.Core.Commands.CreateCompany;

internal class CreateCompany(ICompanyRepository _companyRepository, ITeamRepository _teamRepository, IMessageBroker _messageBroker) : ICommandHandler<CreateCompanyCommand>
{
    private readonly IMessageBroker messageBroker = _messageBroker;
    private readonly ICompanyRepository companyRepository = _companyRepository;
    private readonly ITeamRepository teamRepository = _teamRepository;

    public async Task HandleAsync(CreateCompanyCommand command, CancellationToken cancellationToken = default)
    {
        var companyDto = command.Company;
        Guid companyId = Guid.NewGuid();
        var result = await Bucket.UploadFile(companyId, companyDto.CompanyName, companyDto.Logo, cancellationToken);
        var company = Company.AddCompany(companyId, companyDto.CompanyName, result.Url);
        var team = Team.AddTeam("Admin", company.Id);

        await messageBroker.PublishAsync(new CompanyRegisteredEvent(companyId, companyDto.CompanyName, result.Extension, companyDto.AdminName, companyDto.Email, companyDto.PhoneNumber), cancellationToken);
        await companyRepository.AddAsync(company, cancellationToken);
        await teamRepository.AddAsync(team, cancellationToken);
    }
}