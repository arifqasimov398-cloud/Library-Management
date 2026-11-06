namespace Web.Persistence.Repositories
{
    public interface IGenericRepository<T> where T : BaseEntity
    {
        void Add(T entity);
        IEnumerable<T> GetAll();
        T? GetById(Guid id); 
        void Delete(T entity);
        void Update(T entity);

    }
}
