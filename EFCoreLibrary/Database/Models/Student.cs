using System;
using System.Collections.Generic;

namespace EfCoreLibrary
{
    public class Student
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public char Sex { get; set; }
        public DateTime Birthday { get; set; }
        public int GroupId { get; set; }

        public Group Group { get; set; }
        public ICollection<Mark> Marks { get; set; }
    }
}
