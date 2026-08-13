using SafeZone.Modules.Organization.Core.Events;
using SafeZone.Shared.Abstractions.Contexts;
using SafeZone.Shared.Abstractions.Messaging;

namespace SafeZone.Modules.Organization.Core.Commands.UpdateCompany;

internal class UpdateCompanyCommandHandler(
    ICompanyRepository _companyRepository,
    IContext _context,
    IMessageBroker _messageBroker,
    Bucket _bucket
    ) : ICommandHandler<UpdateCompanyCommand>
{
    private readonly ICompanyRepository companyRepository = _companyRepository;
    private readonly IContext context = _context;
    private readonly IMessageBroker messageBroker = _messageBroker;
    private readonly Bucket bucket = _bucket;

    public async Task HandleAsync(UpdateCompanyCommand command, CancellationToken cancellationToken = default)
    {
        Guid companyId = Guid.Parse(context.Identity.Claims["CompanyId"].First());
        var company = await companyRepository.GetByIdAsync(companyId, cancellationToken);
        var extension = Path.GetExtension(company.LogoUrl);
        if (command.Logo is not null)
        {
            var result = await bucket.UploadFile(companyId, command.Name, command.Logo, company.LogoUrl, cancellationToken);
            company.UpdateCompany(command.Name, result.Url);
            extension = result.Extension;
        }
        else
        {
            company.UpdateCompany(command.Name, company.LogoUrl);
        }
        await companyRepository.SaveAsync(cancellationToken);
        _ = messageBroker.PublishAsync(new CompanyUpdatedEvent(companyId, command.Name, extension, company.LogoUrl), cancellationToken);
    }
}
