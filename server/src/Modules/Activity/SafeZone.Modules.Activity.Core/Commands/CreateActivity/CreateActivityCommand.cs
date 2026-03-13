using SafeZone.Modules.Activity.Core.Domain.Entities;
using SafeZone.Shared.Abstractions.Commands;

namespace SafeZone.Modules.Activity.Core.Commands.CreateActivity;

internal record CreateActivityCommand(ActivityEntity Activity) : ICommand<ActivityEntity>;