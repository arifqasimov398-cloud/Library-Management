
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
        public IActionResult Create(CreateCategoryDto dto)
        {
            var category = new Category { Name = dto.Name };
            context.Add(category);
            return Ok(category);
        }
    }
}
