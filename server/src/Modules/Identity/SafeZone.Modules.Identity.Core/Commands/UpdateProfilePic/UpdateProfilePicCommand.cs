using Microsoft.AspNetCore.Http;

namespace SafeZone.Modules.Identity.Core.Commands.UpdateProfilePic;

internal record UpdateProfilePicCommand(IFormFile File) : ICommand<string>;