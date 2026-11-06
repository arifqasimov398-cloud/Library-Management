namespace Web.Application.Conturollers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController(ICategoryRepository context) : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(context.GetAll());
        }
        [HttpPost]
        public IActionResult Create(Category category)
        {       
            context.Add(category);
            return Created(string.Empty,  category);
        }
    }
}
