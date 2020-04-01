using System;

namespace EfCoreLibrary
{
    public class Mark
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int LessonId { get; set; }
        public int Value { get; set; }
        public DateTime Date { get; set; }

        public Student Student { get; set; }
        public Lesson Lesson { get; set; }
    }
}
