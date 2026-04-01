namespace SafeZone.Modules.Organization.Core.Commands.UpdateCompany;

internal class UpdateCompanyCommandHandler(ICompanyRepository _companyRepository) : ICommandHandler<UpdateCompanyCommand>
{
    private readonly ICompanyRepository companyRepository = _companyRepository;

    public async Task HandleAsync(UpdateCompanyCommand command, CancellationToken cancellationToken = default)
    {
        var url = await Bucket.UploadFile(command.Logo, cancellationToken);
        var company = await companyRepository.GetByIdAsync(command.Id, cancellationToken);
        company.UpdateCompany(command.Name, url);
        await companyRepository.SaveAsync(cancellationToken);
    }
}