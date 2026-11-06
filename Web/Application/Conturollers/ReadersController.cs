namespace Web.Application.Conturollers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReadersController(IReaderRepository context) : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(context.GetAll());
        }

        [HttpPost]
        public IActionResult Create(Reader reader)
        {
            if (reader == null)
            {
                return BadRequest("Melumat yoxdu qaqa ");
            }

            context.Add(reader);
            return Created(string.Empty, reader);
        }

        
        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            var reader = context.GetById(id);
            if (reader == null)
            {
                return NotFound();
            }
            context.Delete(reader);   
            return Ok();
        }
    }
}
