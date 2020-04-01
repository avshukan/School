using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace EfCoreLibrary
{
    public class SchoolService
    {
        private readonly DatabaseContext context;

        public SchoolService(DatabaseContext context)
        {
            this.context = context;
        }

        public Teacher[] GetTeachersList() =>
            context.Teachers.ToArray();

        public Teacher[] GetTeachersList(string searchString, int page, int pageSize)
        {
            IQueryable<Teacher> teachers = context
                .Teachers
                    .Include(t => t.Groups)
                    .Include(t => t.Lessons);
            if (!string.IsNullOrEmpty(searchString))
                teachers = teachers
                    .Where(t => EF.Functions.ILike(t.Name, $"%{searchString}%") || EF.Functions.ILike(t.Surname, $"%{searchString}%"));
            teachers = teachers
                .Skip(pageSize * (page - 1))
                .Take(pageSize);
            return teachers.ToArray();
        }

        public int GetTeachersCount(string searchString)
        {
            IQueryable<Teacher> teachers = context.Teachers;
            if (!string.IsNullOrEmpty(searchString))
                teachers = teachers
                    .Where(t => EF.Functions.ILike(t.Name, $"%{searchString}%") || EF.Functions.ILike(t.Surname, $"%{searchString}%"));
            return teachers.Count();
        }

        public Teacher FindTeacherById(int id)
        {
            return context
                .Teachers
                    .Include(t => t.Groups)
                    .Include(t => t.Lessons)
                    .FirstOrDefault(t => t.Id == id);
        }

        public Teacher CreateTeacher(Teacher teacher)
        {
            context.Teachers.Add(teacher);
            context.SaveChanges();
            return teacher;
        }


        public void UpdateTeacher(Teacher teacher)
        {
            var dbTeacher = context.Teachers.FirstOrDefault(p => p.Id == teacher.Id);
            dbTeacher.Name = teacher.Name;
            dbTeacher.Surname = teacher.Surname;
            dbTeacher.Birthday = teacher.Birthday;
            dbTeacher.Salary = teacher.Salary;
            dbTeacher.Sex = teacher.Sex;
            context.SaveChanges();
        }


        public void DeleteTeacher(int id)
        {
            var teacher = context.Teachers.SingleOrDefault(t => t.Id == id);
            if (teacher == null)
                throw new KeyNotFoundException($"Teacher with id={id} not found.");
            context.Teachers.Remove(teacher);
            context.SaveChanges();
        }

        public Lesson[] GetLessonsList(string searchString, int page, int pageSize)
        {
            IQueryable<Lesson> lessons = context
                .Lessons
                    .Include(l => l.Teacher)
                    .Include(l => l.Marks);
            if (!string.IsNullOrEmpty(searchString))
                lessons = lessons.Where(l => EF.Functions.ILike(l.Name, $"%{searchString}%"));
            lessons = lessons
                .Skip(pageSize * (page - 1))
                .Take(pageSize);
            return lessons.ToArray();
        }

        public int GetLessonsCount(string searchString)
        {
            if (string.IsNullOrEmpty(searchString))
                return context.Lessons.Count();
            return context
                .Lessons
                    .Where(l => EF.Functions.ILike(l.Name, $"%{searchString}%"))
                    .Count();
        }

        public Lesson FindLessonById(int id)
        {
            return context
                .Lessons
                    .Include(l => l.Teacher)
                    .Include(l => l.Marks)
                        .ThenInclude(m => m.Student)
                    .FirstOrDefault(l => l.Id == id);
        }

        public Lesson CreateLesson(Lesson lesson)
        {
            context.Lessons.Add(lesson);
            context.SaveChanges();
            return lesson;
        }

        public void UpdateLesson(Lesson lesson)
        {
            var _lesson = context.Lessons.FirstOrDefault(l => l.Id == lesson.Id);
            _lesson.Name = lesson.Name;
            _lesson.TeacherId = lesson.TeacherId;
            _lesson.Hours = lesson.Hours;
            _lesson.Required = lesson.Required;
            context.SaveChanges();
        }

        public void DeleteLesson(int id)
        {
            var lesson = context.Lessons.SingleOrDefault(l => l.Id == id);
            if (lesson == null)
                throw new KeyNotFoundException($"Lesson with id={id} not found.");
            context.Lessons.Remove(lesson);
            context.SaveChanges();
        }

        public Group[] GetGroupsList(string searchString, int page, int pageSize)
        {
            IQueryable<Group> groups = context
                .Groups
                    .Include(g => g.Teacher)
                    .Include(g => g.Students);
            if (!string.IsNullOrEmpty(searchString))
                groups = groups
                    .Where(g => EF.Functions.ILike(g.Grade.ToString(), searchString) || g.Literal.ToString() == searchString);
            return groups
                .Skip(pageSize * (page - 1))
                    .Take(pageSize)
                    .ToArray();
        }

        public int GetGroupsCount(string searchString) =>
            context.Groups.Count();

        public Group FindGroupById(int id)
        {
            return context
                .Groups
                    .Include(g => g.Teacher)
                    .Include(g => g.Students)
                    .FirstOrDefault(g => g.Id == id);
        }

        public Group CreateGroup(Group group)
        {
            context.Groups.Add(group);
            context.SaveChanges();
            return group;
        }

        public void UpdateGroup(Group group)
        {
            var dbGroup = context.Groups.FirstOrDefault(g => g.Id == group.Id);
            dbGroup.Grade = group.Grade;
            dbGroup.Literal = group.Literal;
            dbGroup.TeacherId = group.TeacherId;
            context.SaveChanges();
        }

        public void DeleteGroup(int id)
        {
            var group = context.Groups.SingleOrDefault(g => g.Id == id);
            if (group == null)
                throw new KeyNotFoundException($"Group with id={id} not found.");
            context.Groups.Remove(group);
            context.SaveChanges();
        }

        public Student[] GetStudentsList(string searchString, int page, int pageSize)
        {
            IQueryable<Student> students = context
                .Students
                    .Include(s => s.Marks)
                    .Include(s => s.Group);

            if (!string.IsNullOrEmpty(searchString))
                students = students
                    .Where(s => EF.Functions.ILike(s.Name, $"%{searchString}%") || EF.Functions.ILike(s.Surname, $"%{searchString}%"));

            students = students
                .Skip(pageSize * (page - 1))
                .Take(pageSize);

            return students.ToArray();
        }

        public int GetStudentsCount(string searchString)
        {
            if (string.IsNullOrEmpty(searchString))
                return context.Students.Count();
            return context
                .Students
                    .Where(s => EF.Functions.ILike(s.Name, $"%{searchString}%") || EF.Functions.ILike(s.Surname, $"%{searchString}%"))
                    .Count();
        }

        public Student FindStudentById(int id)
        {
            return context
                .Students
                    .Include(s => s.Group)
                    .Include(s => s.Marks)
                        .ThenInclude(m => m.Lesson)
                    .FirstOrDefault(s => s.Id == id);
        }

        public Student CreateStudent(Student student)
        {
            context.Students.Add(student);
            context.SaveChanges();
            return student;
        }

        public void UpdateStudent(Student student)
        {
            var dbStudent = context.Students.FirstOrDefault(s => s.Id == student.Id);
            dbStudent.Name = student.Name;
            dbStudent.Surname = student.Surname;
            dbStudent.Birthday = student.Birthday;
            dbStudent.Sex = student.Sex;
            dbStudent.GroupId = student.GroupId;
            context.SaveChanges();
        }

        public void DeleteStudent(int id)
        {
            var student = context.Students.SingleOrDefault(l => l.Id == id);
            if (student == null)
                throw new KeyNotFoundException($"Student with id={id} not found.");
            context.Students.Remove(student);
            context.SaveChanges();
        }

        public Mark[] GetMarksList(int lessonId, int studentId, int page, int pageSize)
        {
            return context
                .Marks
                    .Include(m => m.Lesson)
                    .Include(m => m.Student)
                .ToArray();
        }

        public int GetMarksCount(int lessonId, int studentId)
        {
            return context.Marks.Count();
        }

        public Mark FindMarkById(int id)
        {
            return context
                .Marks
                    .Include(m => m.Lesson)
                    .Include(m => m.Student)
                    .FirstOrDefault(m => m.Id == id);
        }

        public Mark CreateMark(Mark mark)
        {
            context.Marks.Add(mark);
            context.SaveChanges();
            return mark;
        }

        public void UpdateMark(Mark mark)
        {
            var dbMark = context.Marks.FirstOrDefault(m => m.Id == mark.Id);
            dbMark.StudentId = mark.StudentId;
            dbMark.LessonId = mark.LessonId;
            dbMark.Value = mark.Value;
            dbMark.Date = mark.Date;
            context.SaveChanges();
        }

        public void DeleteMark(int id)
        {
            var mark = context.Marks.SingleOrDefault(m => m.Id == id);
            if (mark == null)
                throw new KeyNotFoundException($"Mark with id={id} not found.");
            context.Marks.Remove(mark);
            context.SaveChanges();
        }
    }
}
