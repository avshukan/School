using System;
using EfCoreLibrary;

namespace NETCoreConsole
{
    public class TeacherController
    {
        private SchoolService schoolService = null;

        public TeacherController(SchoolService schoolService)
        {
            this.schoolService = schoolService;
        }

        public void Run()
        {
            var title = "teachers";
            var searchString = "";
            var page = 1;
            var pageSize = 4;
            int? teacherId = null;
            ConsoleKey key = ConsoleKey.Spacebar;
            while (key != ConsoleKey.Escape)
            {
                var info = new string[0];
                var teachers = schoolService.GetTeachersList(searchString, page, pageSize);
                if (teacherId != null)
                    info = schoolService.FindTeacherById((int)teacherId).getInfo();
                var count = schoolService.GetTeachersCount(searchString);
                var pagesCount = (count - 1) / pageSize + 1;
                Menu.PrintSubMenu(title, teachers, info, count, searchString, page, pagesCount);
                key = Console.ReadKey(true).Key;
                if (key != ConsoleKey.S)
                    teacherId = null;
                switch (key)
                {
                    case ConsoleKey.PageDown:
                        if (page < pagesCount)
                            page++;
                        break;
                    case ConsoleKey.PageUp:
                        if (page > 1)
                            page--;
                        break;
                    case ConsoleKey.F:
                        Console.Write("Set filter:");
                        searchString = Console.ReadLine();
                        page = 1;
                        break;
                    case ConsoleKey.S:
                        Console.Write("Select Id:");
                        teacherId = Convert.ToInt32(Console.ReadLine());
                        break;
                    case ConsoleKey.C:
                        try
                        {
                            Console.Write("Set name:");
                            string name = Console.ReadLine();
                            Console.Write("Set surname:");
                            string surname = Console.ReadLine();
                            Console.Write("Set birthday (yyyy/mm/dd):");
                            string birthday = Console.ReadLine();
                            Console.Write("Set sex:");
                            string sex = Console.ReadLine();
                            Console.Write("Set salary:");
                            string salary = Console.ReadLine();
                            var teacher = new Teacher
                            {
                                Id = 0,
                                Name = name,
                                Surname = surname,
                                Birthday = Convert.ToDateTime(birthday),
                                Sex = Convert.ToChar(sex),
                                Salary = Convert.ToInt32(salary)
                            };
                            schoolService.CreateTeacher(teacher);
                            Console.WriteLine("Teacher created");
                        }
                        catch (Exception e)
                        {
                            Console.WriteLine(e.Message);
                        }
                        Console.WriteLine("Press any key to continue...");
                        Console.ReadKey();
                        break;
                    case ConsoleKey.U:
                        try
                        {
                            Console.Write("Set id:");
                            var id = Console.ReadLine();
                            Console.Write("Set name:");
                            var name = Console.ReadLine();
                            Console.Write("Set surname:");
                            var surname = Console.ReadLine();
                            Console.Write("Set birthday (yyyy/mm/dd):");
                            var birthday = Console.ReadLine();
                            Console.Write("Set sex:");
                            var sex = Console.ReadLine();
                            Console.Write("Set salary:");
                            var salary = Console.ReadLine();
                            var teacher = new Teacher
                            {
                                Id = Convert.ToInt32(id),
                                Name = name,
                                Surname = surname,
                                Birthday = Convert.ToDateTime(birthday),
                                Sex = Convert.ToChar(sex),
                                Salary = Convert.ToInt32(salary)
                            };
                            schoolService.UpdateTeacher(teacher);
                            Console.WriteLine("Teacher updated");
                        }
                        catch (Exception e)
                        {
                            Console.WriteLine(e.Message);
                        }
                        Console.WriteLine("Press any key to continue...");
                        Console.ReadKey();
                        break;
                    case ConsoleKey.D:
                        try
                        {
                            Console.Write("Set id:");
                            string id = Console.ReadLine();
                            schoolService.DeleteTeacher(Convert.ToInt32(id));
                            Console.WriteLine("Teacher deleted");
                        }
                        catch (Exception e)
                        {
                            Console.WriteLine(e.Message);
                        }
                        Console.WriteLine("Press any key to continue...");
                        Console.ReadKey();
                        break;
                }
            }
        }
    }
}
