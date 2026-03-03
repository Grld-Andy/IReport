namespace SafeZone.Modules.Identity.Core.Exceptions;

internal class UserNotFoundException(object key, string name = "User") : NotFoundException(name, key)
{
}