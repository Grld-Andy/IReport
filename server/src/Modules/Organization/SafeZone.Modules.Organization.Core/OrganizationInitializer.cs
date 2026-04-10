using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SafeZone.Modules.Organization.Core.DAL;
using SafeZone.Shared.Infrastructure;

namespace SafeZone.Modules.Organization.Core;

internal class OrganizationInitializer(ILogger<OrganizationInitializer> _logger, OrganizationDbContext _OrganizationDbContext) : IInitializer
{
    private readonly OrganizationDbContext OrganizationDbContext = _OrganizationDbContext;
    private readonly ILogger<OrganizationInitializer> logger = _logger;

    public async Task InitAsync()
    {
        await AddCompany();
        await AddAdminTeam();
    }

    private async Task AddCompany()
    {
        if(await OrganizationDbContext.Teams.AnyAsync()){
            return;
        }
        var company = Company.AddCompany(
            id: Guid.Parse("fac586f8-1ffa-4cca-9bb0-224736bbc5a4"),
            name: "SafeZone",
            logoUrl: "uploads/profiles/fac586f8-1ffa-4cca-9bb0-224736bbc5a4_SafeZone.webp",
            paymentReference: "rand0m1"
        );
        OrganizationDbContext.Companies.Add(company);
        await OrganizationDbContext.SaveChangesAsync();

        logger.LogInformation($"[INIT] [ORGANIZATION] Created Company successfully");
    }

    private async Task AddAdminTeam()
    {
        if(await OrganizationDbContext.Teams.AnyAsync()){
            return;
        }
        var companyId = OrganizationDbContext.Companies.First(c => c.Name == "SafeZone").Id;
        var adminTeam = Team.AddTeam("Admin", companyId);
        OrganizationDbContext.Teams.Add(adminTeam);
        await OrganizationDbContext.SaveChangesAsync();

        logger.LogInformation($"[INIT] [ORGANIZATION] Created Admin Team successfully");
    }
}