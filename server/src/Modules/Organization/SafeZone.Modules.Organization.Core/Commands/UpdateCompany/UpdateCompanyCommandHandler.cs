namespace SafeZone.Modules.Organization.Core.Commands.UpdateCompany;

internal class UpdateCompanyCommandHandler(ICompanyRepository _companyRepository) : ICommandHandler<UpdateCompanyCommand>
{
    private readonly ICompanyRepository companyRepository = _companyRepository;

    public async Task HandleAsync(UpdateCompanyCommand command, CancellationToken cancellationToken = default)
    {
        var result = await Bucket.UploadFile(command.Id, command.Name, command.Logo, cancellationToken);
        var company = await companyRepository.GetByIdAsync(command.Id, cancellationToken);
        company.UpdateCompany(command.Name, result.Url);
        await companyRepository.SaveAsync(cancellationToken);
    }
}