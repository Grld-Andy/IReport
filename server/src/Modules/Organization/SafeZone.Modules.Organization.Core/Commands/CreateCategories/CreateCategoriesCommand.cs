using SafeZone.Modules.Organization.Core.DTO;

namespace SafeZone.Modules.Organization.Core.Commands.CreateCategories;

internal record CreateCategoriesCommand(List<CreateCategoryDto> CreateCategoriess) : ICommand;