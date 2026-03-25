using System;

namespace SafeZone.Shared.Abstractions.Exceptions.ExceptionClasses;

public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message){}
    public NotFoundException(string name, object key) : base($"{name}, {key} was not found."){}
}
