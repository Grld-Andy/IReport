namespace SafeZone.Modules.Identity.Core.Commands.CreateUserCompany;

internal class CreateUserCompany(ICompanyRepository _companyRepository) : ICommandHandler<CreateUserCompanyCommand>
{
    private readonly ICompanyRepository companyRepository = _companyRepository;

    public async Task HandleAsync(CreateUserCompanyCommand command, CancellationToken cancellationToken = default)
    {
        await companyRepository.AddAsync(command.Company, cancellationToken);
    }
}