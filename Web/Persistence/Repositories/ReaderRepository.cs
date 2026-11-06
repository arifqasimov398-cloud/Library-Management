using Web.Domain;

namespace Web.Persistence.Repositories
{
    public class ReaderRepository(AppDbContext context):GenericRepository<Reader>(context ), IReaderRepository
    {
    }
}
