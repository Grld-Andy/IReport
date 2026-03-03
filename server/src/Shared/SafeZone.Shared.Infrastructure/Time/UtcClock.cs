using System;
using SafeZone.Shared.Abstractions.Time;

namespace SafeZone.Shared.Infrastructure.Time;

public class UtcClock : IClock
{
    public DateTime CurrentDate() => DateTime.UtcNow;
}


