using Web.Domain;

namespace Web.Persistence.Repositories
{
    public class BookRepository(AppDbContext context): GenericRepository<Book>(context), IBookRepository
    {
        
    }
}
