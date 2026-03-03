using SafeZone.Shared.Abstractions.Exceptions.ExceptionClasses;

namespace SafeZone.Modules.Incident.Core.Domain.ValueObjects;

internal sealed class IncidentLocation : IEquatable<IncidentLocation>
{
    public double Longitude { get; }
    public double Latitude { get; }
    public string ExtraDetails { get; }

    public IncidentLocation(double longitude, double latitude, string extraDetails)
    {
        if (latitude is < -90 or > 90)
            throw new BadRequestException("Latitude must be between -90 and 90.");

        if (longitude is < -180 or > 180)
            throw new BadRequestException("Longitude must be between -180 and 180.");

        if (string.IsNullOrWhiteSpace(extraDetails))
            throw new BadRequestException("Location details cannot be empty.");

        Latitude = latitude;
        Longitude = longitude;
        ExtraDetails = extraDetails;
    }

    public bool Equals(IncidentLocation? other)
    {
        if (other is null) return false;

        return Latitude == other.Latitude
            && Longitude == other.Longitude
            && ExtraDetails == other.ExtraDetails;
    }

    public override bool Equals(object? obj) =>
        obj is IncidentLocation other && Equals(other);

    public override int GetHashCode() =>
        HashCode.Combine(Latitude, Longitude, ExtraDetails);
}