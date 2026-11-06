namespace Web.Application.Conturollers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController(IBookRepository context) : ControllerBase
    {
        [HttpPost]
        public IActionResult Create(CreateBookDto dto)
        {
            if(dto==null)
            {
                return BadRequest("Melumat yoxdu qaqa ");
            }
            var kitablar = context.GetAll();
            bool olan = false;

            foreach (var b in kitablar)
            {
                if (b.Title == dto.Title && b.Author == dto.Author)
                {
                    olan = true;
                }
            }

            if (olan)
            {
                return Conflict("Bu kitab artıq var");
            }
            var book = new Book
            {
                Title = dto.Title,
                Author = dto.Author,
                Price = dto.Price,
                CategoryId = dto.CategoryId
            };

            context.Add(book);
            return Created( string.Empty, book);
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(context.GetAll());
        }
        [HttpGet("{id}")]
        public IActionResult GetById(Guid id)
        {
            var book = context.GetById(id);
            if (book == null)
            {
                return NotFound();
            }
            return Ok("al bu da sene GetById");
        }
        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            var book = context.GetById(id);
            if (book == null)
            {
                return NotFound();
            }
            context.Delete(id);
            return Ok("BU kitab getdi rehmete");
        }
        [HttpPut("{id}")]
        public IActionResult Update(Guid id, CreateBookDto dto)
        {
            var book = context.GetById(id);
            if (book == null)
            {
                return NotFound();
            }
            book.Title = dto.Title;
            book.Price = dto.Price;
            book.CategoryId = dto.CategoryId;
            book.Author = dto.Author;
            context.Update(id);
            return Ok("BU kitabda deyisiklik oldu qedeş");
        }
        
    }
}

