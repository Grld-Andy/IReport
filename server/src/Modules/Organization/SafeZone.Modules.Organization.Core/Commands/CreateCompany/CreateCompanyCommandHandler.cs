using SafeZone.Shared.Abstractions.Messaging;

namespace SafeZone.Modules.Organization.Core.Commands.CreateCompany;

// handle company creation and user creation
internal class CreateCompany(ICompanyRepository _companyRepository, IMessageBroker _messageBroker) : ICommandHandler<CreateCompanyCommand>
{
    private readonly IMessageBroker messageBroker = _messageBroker;
    private readonly ICompanyRepository companyRepository = _companyRepository;

    public async Task HandleAsync(CreateCompanyCommand command, CancellationToken cancellationToken = default)
    {
        var url = await Bucket.UploadFile(command.Company.Logo, cancellationToken);
        var company = Company.AddCompany(command.Company.CompanyName, url);
        await companyRepository.AddAsync(company, cancellationToken);
    }
}