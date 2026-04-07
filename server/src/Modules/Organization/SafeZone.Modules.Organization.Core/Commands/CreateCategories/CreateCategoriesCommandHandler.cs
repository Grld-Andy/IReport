namespace SafeZone.Modules.Organization.Core.Commands.CreateCategories;

internal class CreateCategoriesCommandHandler(ICategoryRepository _categoryRepository) : ICommandHandler<CreateCategoriesCommand>
{
    private readonly ICategoryRepository categoryRepository = _categoryRepository;

    async Task ICommandHandler<CreateCategoriesCommand>.HandleAsync(CreateCategoriesCommand command, CancellationToken cancellationToken)
    {

        var categories = new List<Category>();
        foreach (var category in categories)
        {
            categories.Add(Category.AddCategory(category.Name, category.CompanyId));
        }
        await categoryRepository.AddListAsync(categories, cancellationToken);
    }
}