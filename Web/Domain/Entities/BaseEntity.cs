namespace Web.Domain.Entities
{
    public class BaseEntity
    {
        public Guid Id { get; set; }=Guid.NewGuid();
    }
}
