using Microsoft.AspNetCore.Mvc;
using EfCoreLibrary;

namespace EfCoreExample.Controllers
{
    [Route("/api/mark")]
    public class MarkController : Controller
    {
        private SchoolService schoolService = null;

        public MarkController(SchoolService schoolService)
        {
            this.schoolService = schoolService;
        }

        [HttpGet]
        public Mark[] GetMarkList([FromQuery] int lessonId, [FromQuery] int studentId, [FromQuery]int page, [FromQuery]int pageSize) => 
            schoolService.GetMarksList(lessonId, studentId, page, pageSize);

        [HttpGet("{id}")]
        public Mark FindMarkById(int id) => 
            schoolService.FindMarkById(id);

        [HttpGet("count")]
        public int GetMarksCount([FromQuery] int lessonId, [FromQuery] int studentId) =>
            schoolService.GetMarksCount(lessonId, studentId);

        [HttpPost]
        public IActionResult CreateMark([FromBody] Mark mark)
        {
            try
            {
                return Ok(schoolService.CreateMark(mark));
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut]
        public IActionResult UpdateMark([FromBody] Mark mark)
        {
            try
            {
                schoolService.UpdateMark(mark);
                return NoContent();
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteMark(int id)
        {
            try
            {
                schoolService.DeleteMark(id);
                return NoContent();
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}
