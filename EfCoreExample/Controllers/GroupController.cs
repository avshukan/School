using Microsoft.AspNetCore.Mvc;
using EfCoreLibrary;

namespace EfCoreExample.Controllers
{
    [Route("/api/group")]
    public class GroupController : Controller
    {
        private SchoolService schoolService = null;

        public GroupController(SchoolService schoolStorage)
        {
            schoolService = schoolStorage;
        }

        [HttpGet]
        public Group[] GetGroupsList([FromQuery]string searchString, [FromQuery]int page, [FromQuery]int pageSize) =>
            schoolService.GetGroupsList(searchString, page, pageSize);

        [HttpGet("{id}")]
        public Group FindGroupById(int id) =>
            schoolService.FindGroupById(id);

        [HttpGet("count")]
        public int GetGroupsCount([FromQuery]string searchString) =>
            schoolService.GetGroupsCount(searchString);

        [HttpPost]
        public IActionResult CreateGroup([FromBody] Group Group)
        {
            try
            {
                return Ok(schoolService.CreateGroup(Group));
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut]
        public IActionResult UpdateGroup([FromBody] Group Group)
        {
            try
            {
                schoolService.UpdateGroup(Group);
                return NoContent();
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteGroup(int id)
        {
            try
            {
                schoolService.DeleteGroup(id);
                return NoContent();
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
