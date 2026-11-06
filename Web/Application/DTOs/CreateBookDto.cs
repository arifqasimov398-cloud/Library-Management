namespace Web.Application.DTOs
{
    public class CreateBookDto
    {
        public string? Title { get; set; } 
        public string Author { get; set; }
        public decimal Price { get; set; }
        public Guid CategoryId { get; set; }
    }
}
