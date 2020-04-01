using Microsoft.AspNetCore.Mvc;
using EfCoreLibrary;

namespace EfCoreExample.Controllers
{
    [Route("/api/teacher")]
    public class TeacherController : Controller
    {
        private SchoolService schoolService = null;

        public TeacherController(SchoolService schoolService)
        {
            this.schoolService = schoolService;
        }

        [HttpGet]
        public Teacher[] GetTeachersList([FromQuery]string searchString, [FromQuery]int page, [FromQuery]int? pageSize)
        {
            if (pageSize != null)
                return schoolService.GetTeachersList(searchString, page, (int)pageSize);
            return schoolService.GetTeachersList();
        }
            

        [HttpGet("{id}")]
        public Teacher FindTeacherById(int id) => 
            schoolService.FindTeacherById(id);

        [HttpGet("count")]
        public int GetTeachersCount([FromQuery] string searchString) =>
            schoolService.GetTeachersCount(searchString);

        [HttpPost]
        public IActionResult CreateTeacher([FromBody] Teacher teacher)
        {
            try
            {
                return Ok(schoolService.CreateTeacher(teacher));
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut]
        public IActionResult UpdateTeacher([FromBody] Teacher teacher)
        {
            try
            {
                schoolService.UpdateTeacher(teacher);
                return NoContent();
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteStudent(int id)
        {
            try
            {
                schoolService.DeleteTeacher(id);
                return NoContent();
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}
