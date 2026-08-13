using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Modules.Identity.Core.Events.External;

internal class CompanyUpdatedEventHandler(ICompanyRepository companyRepository) : IEventHandler<CompanyUpdatedEvent>
{
    public async Task HandleAsync(CompanyUpdatedEvent @event, CancellationToken cancellationToken = default)
    {
        var company = await companyRepository.GetByIdAsync(@event.CompanyId, cancellationToken);
        company.UpdateCompany(@event.CompanyName, @event.Extension, @event.LogoUrl);
        await companyRepository.SaveAsync(cancellationToken);
    }
}
