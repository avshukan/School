using System.Collections.Generic;

namespace EfCoreLibrary
{
    public class Group
    {
        public int Id { get; set; }
        public char Literal { get; set; }
        public int Grade { get; set; }
        public int TeacherId { get; set; }

        public Teacher Teacher { get; set; }
        public ICollection<Student> Students { get; set; }
    }
}