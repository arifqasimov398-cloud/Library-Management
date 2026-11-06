using Web.Domain;

namespace Web.Persistence.Repositories
{
    public class CategoryRepository(AppDbContext context) : GenericRepository<Category>(context), ICategoryRepository
    {

    }
}
