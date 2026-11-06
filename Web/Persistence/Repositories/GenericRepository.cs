using Web.Domain;
using Web.Domain.Entities;
namespace Web.Persistence.Repositories
{
    public class GenericRepository<T>(AppDbContext context) : IGenericRepository<T> where T : BaseEntity
    {
        public IEnumerable<T> GetAll()
        {
            return context.Set<T>().ToList();
        }
        public T? GetById(Guid id)
        {
            return context.Set<T>().Find(id);
        }
        public void Add(T entity)
        {
            context.Set<T>().Add(entity);
            context.SaveChanges();
        }
        public void Update(T entity )
        {
                context.Set<T>().Update(entity);
                context.SaveChanges();
        }
        public void Delete(T entity)
        {
                context.Set<T>().Remove(entity);
                context.SaveChanges();
            
        }
    }
}
