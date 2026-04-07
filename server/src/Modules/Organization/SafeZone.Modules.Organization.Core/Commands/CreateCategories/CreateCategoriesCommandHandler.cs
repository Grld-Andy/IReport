using SafeZone.Shared.Abstractions.Contexts;

namespace SafeZone.Modules.Organization.Core.Commands.CreateCategories;

internal class CreateCategoriesCommandHandler(ICategoryRepository _categoryRepository, IContext _context) : ICommandHandler<CreateCategoriesCommand>
{
    private readonly ICategoryRepository categoryRepository = _categoryRepository;
    private readonly IContext context = _context;

    async Task ICommandHandler<CreateCategoriesCommand>.HandleAsync(CreateCategoriesCommand command, CancellationToken cancellationToken)
    {
        Guid companyId = Guid.Parse(context.Identity.Claims["CompanyId"].First());
        var categories = new List<Category>();
        foreach (var category in command.Categories)
        {
            categories.Add(Category.AddCategory(category.Name, companyId));
        }
        await categoryRepository.AddListAsync(categories, cancellationToken);
    }
}