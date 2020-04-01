using System;
using System.Collections.Generic;

namespace EfCoreLibrary
{
    public class Teacher : IToStringForConsole
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public DateTime Birthday { get; set; }
        public char Sex { get; set; }
        public int Salary { get; set; }

        public ICollection<Group> Groups { get; set; }
        public ICollection<Lesson> Lessons { get; set; }

        public string ToStringForConsole() =>
            string.Format("{0, 4}. {1, -12}{2, -12} {3} {4, 3} {5, 6}", Id, Name, Surname, Birthday.ToString().Substring(0,10), Sex, Salary);

        public string[] getInfo()
        {
            List<string> info = new List<string>();
            info.Add($"Id: {Id}");
            info.Add($"Name: {Name}");
            info.Add($"Surname:{Surname}");
            info.Add($"Birthday:{Convert.ToString(Birthday).Substring(0,10)}");
            info.Add($"Sex:{Sex}");
            info.Add($"Salary:{Salary}");
            var groups = "";
            foreach (var group in Groups)
                groups += $"{group.Grade}{group.Literal},";
            info.Add($"Groups:{groups.TrimEnd(',')}");
            var lessons = "";
            foreach (var lesson in Lessons)
                lessons += $"{lesson.Name},";
            info.Add($"Lessons:{lessons.TrimEnd(',')}");
            return info.ToArray();
        }
    }
}
