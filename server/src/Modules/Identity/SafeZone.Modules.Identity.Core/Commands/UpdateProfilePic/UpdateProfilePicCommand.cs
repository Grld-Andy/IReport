using Microsoft.AspNetCore.Http;

namespace SafeZone.Modules.Identity.Core.Commands.UpdateProfilePic;

internal record UpdateProfilePicCommand(Guid Id, IFormFile File) : ICommand<string>;