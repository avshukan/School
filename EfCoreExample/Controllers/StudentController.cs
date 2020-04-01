using Microsoft.AspNetCore.Mvc;
using EfCoreLibrary;

namespace EfCoreExample.Controllers
{
    [Route("/api/student")]
    public class StudentController : Controller
    {
        private SchoolService schoolService = null;

        public StudentController(SchoolService schoolService)
        {
            this.schoolService = schoolService;
        }

        [HttpGet]
        public Student[] GetStudentsList([FromQuery]string searchString, [FromQuery]int page, [FromQuery]int pageSize) => 
            schoolService.GetStudentsList(searchString, page, pageSize);

        [HttpGet("{id}")]
        public Student FindStudentById(int id) => 
            schoolService.FindStudentById(id);

        [HttpGet("count")]
        public int GetStudentsCount([FromQuery] string searchString) =>
            schoolService.GetStudentsCount(searchString);

        [HttpPost]
        public IActionResult CreateStudent([FromBody] Student student)
        {
            try
            {
                return Ok(schoolService.CreateStudent(student));
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut]
        public IActionResult UpdateStudent([FromBody] Student student)
        {
            try
            {
                schoolService.UpdateStudent(student);
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
                schoolService.DeleteStudent(id);
                return NoContent();
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}
