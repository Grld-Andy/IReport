using SafeZone.Shared.Abstractions.Queries;

namespace SafeZone.Modules.Organization.Core.Queries.GetCategories;

internal record GetCategoriesQuery() : IQuery<IEnumerable<Category>>;