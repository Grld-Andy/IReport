using SafeZone.Shared.Abstractions.Contexts;

namespace SafeZone.Modules.Organization.Core.Commands.UpdateCompany;

internal class UpdateCompanyCommandHandler(ICompanyRepository _companyRepository, IContext _context) : ICommandHandler<UpdateCompanyCommand>
{
    private readonly ICompanyRepository companyRepository = _companyRepository;
    private readonly IContext context = _context;

    public async Task HandleAsync(UpdateCompanyCommand command, CancellationToken cancellationToken = default)
    {
        Guid companyId = Guid.Parse(context.Identity.Claims["CompanyId"].First());
        var company = await companyRepository.GetByIdAsync(companyId, cancellationToken);
        if(command.Logo is not null){
            var result = await Bucket.UploadFile(companyId, command.Name, command.Logo, cancellationToken);
            company.UpdateCompany(command.Name, result.Url);
        }
        else
        {
            company.UpdateCompany(command.Name, company.LogoUrl);
        }
        await companyRepository.SaveAsync(cancellationToken);
    }
}