namespace SafeZone.Modules.Organization.Core.Commands.CreateCompany;

internal record CreateCompany(ICompanyRepository _companyRepository) : ICommandHandler<CreateCompanyCommand>
{
    private readonly ICompanyRepository companyRepository = _companyRepository;

    public async Task HandleAsync(CreateCompanyCommand command, CancellationToken cancellationToken = default)
    {
        var url = await Bucket.UploadFile(command.Logo, cancellationToken);
        var company = Company.AddCompany(command.Name, url);
        await companyRepository.AddAsync(company, cancellationToken);
    }
}