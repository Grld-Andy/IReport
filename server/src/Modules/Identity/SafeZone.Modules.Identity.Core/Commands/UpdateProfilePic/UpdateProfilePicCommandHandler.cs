using Microsoft.AspNetCore.Http;
using SafeZone.Modules.Identity.Core.Events.External;
using SafeZone.Shared.Abstractions.Contexts;

namespace SafeZone.Modules.Identity.Core.Commands.UpdateProfilePic;

internal class UpdateProfilePicCommandHandler(IUserRepository _userRepository, IContext _context, IMessageBroker _messageBroker) : ICommandHandler<UpdateProfilePicCommand, string>
{
    private readonly IUserRepository userRepository = _userRepository;
    private readonly IMessageBroker messageBroker = _messageBroker;
    private readonly IContext context = _context;

    public async Task<string> HandleAsync(UpdateProfilePicCommand command, CancellationToken cancellationToken = default)
    {
        var file = command.File;
        if(file.Length <= 0)
        {
            throw new BadRequestException("Invalid Image");
        }
        if (!file.ContentType.StartsWith("image/"))
        {
            throw new BadRequestException("Please provide an image");
        }

        var user = await userRepository.GetIdAsync(context.Identity.Id, cancellationToken);
        var url = await UploadFile(file, cancellationToken);

        user.UpdateProfilePic(url);
        await userRepository.SaveAsync(cancellationToken);

        _ = messageBroker.PublishAsync(new ActivityCreatedEvent(
            context.Identity.Id,
            context.Identity.Claims["Name"].First(),
            "updated account",
            $"Changed profile image",
            "User"
        ), cancellationToken);

        return url;
    }

    private static async Task<string> UploadFile(IFormFile file, CancellationToken cancellationToken)
    {
        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "profiles");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var safeFileName = Path.GetFileName(file.FileName);
        var fileName = $"{Guid.NewGuid()}_{safeFileName}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream, cancellationToken);

        return $"uploads/profiles/{fileName}";
    }
}