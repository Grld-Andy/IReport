using SafeZone.Modules.Identity.Core.DTO;
namespace SafeZone.Modules.Identity.Core.DAL;

internal static class UserMapper
{
    public static User ToEntity(UserCreateDto dto)
    {
        var now = DateTime.UtcNow;

        return User.Register(
            new UserName(dto.Name),
            new UserEmail(dto.Email),
            new UserPassword(dto.Password),
            UserRole.From(dto.Role),
            now
        );
    }
}