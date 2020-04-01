using System.Collections.Generic;
using System;

namespace EfCoreLibrary
{
    public class Lesson : IToStringForConsole
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Hours { get; set; }
        public bool Required { get; set; }
        public int TeacherId { get; set; }

        public Teacher Teacher { get; set; }
        public ICollection<Mark> Marks { get; set; }

        public string[] getInfo()
        {
            var info = new List<string>();
            info.Add($"Id: {Id}");
            info.Add($"Name: {Name}");
            info.Add($"Hours: {Hours}");
            info.Add($"Required: " + ((Required) ? "Yes" : "No"));
            info.Add($"Teacher: {Teacher.Name} {Teacher.Surname}");
            var marks = "";
            foreach (var mark in Marks)
                marks += marks + $"{mark.Value} by {mark.Student.Name} {mark.Student.Surname} at {Convert.ToString(mark.Date).Substring(0, 10)}, ";
            info.Add($"Marks: {marks.TrimEnd(',')}");
            return info.ToArray();
        }

        public string ToStringForConsole()
        {
            return string.Format("{0,4}. {1,-16} {2,3} {3,-3}", Id, Name, Hours, (Required ? "Yes" : "No"));
        }
    }
}
