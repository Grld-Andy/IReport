using SafeZone.Modules.Activity.Core.Domain.Entities;
using SafeZone.Modules.Activity.Core.Domain.Repositories;
using SafeZone.Shared.Abstractions.Commands;

namespace SafeZone.Modules.Activity.Core.Commands.CreateActivity;

internal class CreateActivityCommandHandler(IActivityRepository _activityRepository) : ICommandHandler<CreateActivityCommand, ActivityEntity>
{
    private readonly IActivityRepository activityRepository = _activityRepository;

    public async Task<ActivityEntity> HandleAsync(CreateActivityCommand command, CancellationToken cancellationToken = default)
    {
        var activity = await activityRepository.AddAsync(command.Activity, cancellationToken);
        return activity;
    }
}