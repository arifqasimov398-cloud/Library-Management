namespace Web.Application.Conturollers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController(IBookRepository context) : ControllerBase
    {
        [HttpPost]
        public IActionResult Create([FromBody] CreateBookDto dto)
        {
            if (dto is null || string.IsNullOrWhiteSpace(dto.Title) ||
                string.IsNullOrWhiteSpace(dto.Author) || dto.Price < 0 ||
                dto.CategoryId == Guid.Empty)
            {
                return BadRequest("Kitab məlumatları düzgün daxil edilməyib.");
            }

            var exists = context.GetAll().Any(book =>
                book.Title == dto.Title && book.Author == dto.Author);

            if (exists)
            {
                return Conflict("Bu kitab artıq kataloqda mövcuddur.");
            }

            var book = new Book
            {
                Title = dto.Title.Trim(),
                Author = dto.Author.Trim(),
                Price = dto.Price,
                CategoryId = dto.CategoryId
            };

            context.Add(book);
            return CreatedAtAction(nameof(GetById), new { id = book.Id }, book);
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(context.GetAll());
        }

        [HttpGet("{id:guid}")]
        public IActionResult GetById(Guid id)
        {
            var book = context.GetById(id);
            return book is null ? NotFound() : Ok(book);
        }

        [HttpPut("{id:guid}")]
        public IActionResult Update(Guid id, [FromBody] CreateBookDto dto)
        {
            if (dto is null || string.IsNullOrWhiteSpace(dto.Title) ||
                string.IsNullOrWhiteSpace(dto.Author) || dto.Price < 0 ||
                dto.CategoryId == Guid.Empty)
            {
                return BadRequest("Kitab məlumatları düzgün daxil edilməyib.");
            }

            var book = context.GetById(id);
            if (book is null)
            {
                return NotFound();
            }

            var duplicate = context.GetAll().Any(item =>
                item.Id != id && item.Title == dto.Title && item.Author == dto.Author);

            if (duplicate)
            {
                return Conflict("Eyni adlı kitab bu müəlliflə artıq mövcuddur.");
            }

            book.Title = dto.Title.Trim();
            book.Author = dto.Author.Trim();
            book.Price = dto.Price;
            book.CategoryId = dto.CategoryId;

            context.Update(book);
            return Ok(book);
        }

        [HttpDelete("{id:guid}")]
        public IActionResult Delete(Guid id)
        {
            var book = context.GetById(id);
            if (book is null)
            {
                return NotFound();
            }

            context.Delete(book);
            return NoContent();
        }
    }
}