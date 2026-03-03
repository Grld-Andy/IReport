using System.Collections.Generic;

namespace SafeZone.Shared.Infrastructure.Modules;

public record ModuleInfo(string Name, IEnumerable<string> Policies);


