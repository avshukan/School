using Microsoft.AspNetCore.Mvc;
using EfCoreLibrary;

namespace EfCoreExample.Controllers
{
    [Route("/api/lesson")]
    public class LessonController : Controller
    {
        private SchoolService schoolService = null;

        public LessonController(SchoolService schoolStorage)
        {
            schoolService = schoolStorage;
        }

        [HttpGet]
        public Lesson[] GetLessonsList([FromQuery]string searchString, [FromQuery]int page, [FromQuery]int pageSize) =>
            schoolService.GetLessonsList(searchString, page, pageSize);

        [HttpGet("{id}")]
        public Lesson FindLessonById(int id) =>
            schoolService.FindLessonById(id);

        [HttpGet("count")]
        public int GetLessonsCount([FromQuery]string searchString) =>
            schoolService.GetLessonsCount(searchString);

        [HttpPost]
        public IActionResult CreateLesson([FromBody] Lesson lesson)
        {
            try
            {
                return Ok(schoolService.CreateLesson(lesson));
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut]
        public IActionResult UpdateLesson([FromBody] Lesson lesson)
        {
            try
            {
                schoolService.UpdateLesson(lesson);
                return NoContent();
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteLesson(int id)
        {
            try
            {
                schoolService.DeleteLesson(id);
                return NoContent();
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
