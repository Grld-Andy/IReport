using SafeZone.Modules.Incident.Core.Clients.DTO;

namespace SafeZone.Modules.Incident.Core.Clients;

internal interface IUserApiClient
{
    Task<List<UserDto>> GetUsersByIds (List<Guid> ids);
    Task<UserDto> GetUserById (Guid id);
}