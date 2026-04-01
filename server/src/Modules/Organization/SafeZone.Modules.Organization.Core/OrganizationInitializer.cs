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
        var company = Company.AddCompany("SafeZone", "");
        OrganizationDbContext.Companies.Add(company);
        await OrganizationDbContext.SaveChangesAsync();

        logger.LogInformation($"[INIT] [ORGANIZATION] Created Company successfully");
    }

    private async Task AddAdminTeam()
    {
        if(await OrganizationDbContext.Teams.AnyAsync()){
            return;
        }
        var companyId = OrganizationDbContext.Teams.First(c => c.Name == "SafeZone").CompanyId;
        var adminTeam = Team.AddTeam("Admin", companyId);
        OrganizationDbContext.Teams.Add(adminTeam);
        await OrganizationDbContext.SaveChangesAsync();

        logger.LogInformation($"[INIT] [ORGANIZATION] Created Admin Team successfully");
    }
}