namespace Web.Domain.Entities
{
    public class Book:BaseEntity
    {
        public string? Title { get; set; }
        public decimal Price { get; set; }
        public Category Category { get; set; }
        public Guid CategoryId { get; set; }
        public string Author { get; set; } 
    }
}
