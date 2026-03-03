using SafeZone.Shared.Abstractions.Exceptions.ExceptionClasses;

namespace SafeZone.Modules.Incident.Core.Domain.ValueObjects;

internal class IncidentDescription
{
    public string Value { get; } = string.Empty;

    public IncidentDescription(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new BadRequestException("Please provide incident description");
        }
        Value = value;
    }

    public static implicit operator string(IncidentDescription incidentDescription) => incidentDescription.Value;
    public static implicit operator IncidentDescription(string value) => new(value);
}