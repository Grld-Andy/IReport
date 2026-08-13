using Microsoft.AspNetCore.Http;
using SafeZone.Modules.Identity.Core.Events.External;
using SafeZone.Shared.Abstractions.Contexts;
using SafeZone.Shared.Abstractions.FileStorage;

namespace SafeZone.Modules.Identity.Core.Commands.UpdateProfilePic;

internal class UpdateProfilePicCommandHandler(
    IUserRepository _userRepository,
    IContext _context,
    IMessageBroker _messageBroker,
    IFileStorage _fileStorage
    ) : ICommandHandler<UpdateProfilePicCommand, string>
{
    private readonly IUserRepository userRepository = _userRepository;
    private readonly IMessageBroker messageBroker = _messageBroker;
    private readonly IContext context = _context;
    private readonly IFileStorage fileStorage = _fileStorage;

    public async Task<string> HandleAsync(UpdateProfilePicCommand command, CancellationToken cancellationToken = default)
    {
        var file = command.File;
        if (file.Length <= 0)
        {
            throw new BadRequestException("Invalid Image");
        }
        if (!file.ContentType.StartsWith("image/"))
        {
            throw new BadRequestException("Please provide an image");
        }

        var user = await userRepository.GetIdAsync(context.Identity.Id, cancellationToken);
        var url = await UploadFile(file, user.ProfilePicUrl, cancellationToken);

        user.UpdateProfilePic(url);
        await userRepository.SaveAsync(cancellationToken);

        _ = messageBroker.PublishAsync(new ActivityCreatedEvent(
            context.Identity.Id,
            context.Identity.Claims["Name"].First(),
            "updated account",
            "Changed profile image",
            "User",
            user.CompanyId
        ), cancellationToken);

        return url;
    }

    private async Task<string> UploadFile(IFormFile file, string oldUrl, CancellationToken cancellationToken)
    {
        var extension = Path.GetExtension(file.FileName);
        var fileName = $"{Guid.NewGuid()}{extension}";
        await using var stream = file.OpenReadStream();
        var url = await fileStorage.UploadAsync($"profiles/{fileName}", stream, file.ContentType, cancellationToken);
        if (!string.IsNullOrWhiteSpace(oldUrl))
        {
            await fileStorage.DeleteAsync(oldUrl, cancellationToken);
        }
        return url;
    }
}
