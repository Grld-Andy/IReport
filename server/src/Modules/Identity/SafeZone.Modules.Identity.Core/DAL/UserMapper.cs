namespace SafeZone.Modules.Identity.Core.DAL;

internal static class UserMapper
{
    public static User ToEntity(UserCreateDto dto)
    {
        var now = DateTime.UtcNow;
        
        return User.Register(
            new UserName(dto.Name),
            new UserEmail(dto.Email),
            new UserPassword("pleasechangeyourpasswordnow13d9843jk"),
            UserRole.From(dto.Role),
            team: dto.Team,
            phoneNumber: dto.PhoneNumber,
            otp: dto.OTP,
            companyId: dto.CompanyId,
            now
        );
    }

    public static UserDetailsDto FromEntity(User user)
    {
        return new UserDetailsDto{
            Id = user.Id,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
            Status = user.Status.Value,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role.Value,
            Team = user.Team,
            ProfilePicUrl = user.ProfilePicUrl,
        };
    }
}