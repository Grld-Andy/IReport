using System;
using SafeZone.Shared.Abstractions.Exceptions;

namespace SafeZone.Shared.Infrastructure.Exceptions;

public interface IExceptionCompositionRoot
{
    ExceptionResponse Map(Exception exception);
}


