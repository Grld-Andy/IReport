using SafeZone.Shared.Abstractions.Exceptions.ExceptionClasses;

namespace SafeZone.Modules.Incident.Core.Domain.ValueObjects;

internal class IncidentSubject
{
    public string Value { get; } = string.Empty;

    public IncidentSubject(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new BadRequestException("Please provide incident subject");
        }
        Value = value;
    }

    public static implicit operator string(IncidentSubject incidentSubject) => incidentSubject.Value;
    public static implicit operator IncidentSubject(string value) => new(value);
}