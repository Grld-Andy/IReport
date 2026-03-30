namespace SafeZone.Modules.Identity.Core.Commands.ChangeStatus;

internal class ChangeStatusCommandHandler(IUserRepository _usersRepository, IMessageBroker _messageBroker) : ICommandHandler<ChangeStatusCommand>
{
    private readonly IUserRepository usersRepository = _usersRepository;
    private readonly IMessageBroker messageBroker = _messageBroker;

    public async Task HandleAsync(ChangeStatusCommand command, CancellationToken cancellationToken = default)
    {
        User user = await usersRepository.GetIdAsync(command.Id, cancellationToken);
        user.ChangeStatus(UserStatus.From(command.Status), new DateTime());
        await usersRepository.SaveAsync(cancellationToken);
        _ = messageBroker.PublishAsync(new UserUpdatedEvent(UserMapper.FromEntity(user)), cancellationToken);
    }
}