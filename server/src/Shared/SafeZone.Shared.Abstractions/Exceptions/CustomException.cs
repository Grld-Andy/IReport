using System;

namespace SafeZone.Shared.Abstractions.Exceptions;

public abstract class CustomException : Exception
{
    protected CustomException(string message) : base(message)
    {
    }
}


