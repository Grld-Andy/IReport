using System.Reflection;
using SafeZone.Modules.Incident.Core.Clients.DTO;
using SafeZone.Shared.Abstractions.Modules;

namespace SafeZone.Modules.Incident.Core.Clients;

internal class UserApiClient(IModuleClient _moduleClient) : IUserApiClient
{
    private readonly IModuleClient moduleClient = _moduleClient;

    public Task<UserDto> GetUserById(Guid id)
    {
        return moduleClient.SendAsync<UserDto>("users/get", new { id });
    }

    public Task<List<UserDto>> GetUsersByIds(List<Guid> ids)
    {
        return moduleClient.SendAsync<List<UserDto>>("users/getall", new { ids });
    }
}