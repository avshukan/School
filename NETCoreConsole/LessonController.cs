using System;
using System.Collections.Generic;
using System.Text;
using EfCoreLibrary;

namespace NETCoreConsole
{
    class LessonController
    {
        private SchoolService schoolService = null;

        public LessonController(SchoolService schoolService)
        {
            this.schoolService = schoolService;
        }

        public void Run()
        {
            var title = "lessons";
            var searchString = "";
            var page = 1;
            var pageSize = 4;
            var key = ConsoleKey.Spacebar;
            var lessonId = 0;
            while (key != ConsoleKey.Escape)
            {
                var lessons = schoolService.GetLessonsList(searchString, page, pageSize);
                var count = schoolService.GetLessonsCount(searchString);
                var pagesCount = (count - 1) / pageSize + 1;
                if (lessonId != 0)
                {
                    var info = schoolService.FindLessonById(lessonId).getInfo();
                    Menu.PrintSubMenu(title, lessons, info, count, searchString, page, pagesCount);
                } else
                {
                    Menu.PrintSubMenu(title, lessons, new string[0], count, searchString, page, pagesCount);
                }
                key = Console.ReadKey(true).Key;
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
                        Console.Write("Set searchstring:");
                        searchString = Console.ReadLine();
                        page = 1;
                        break;
                    case ConsoleKey.S:
                        Console.Write("Select lesson id:");
                        lessonId = Convert.ToInt32(Console.ReadLine());
                        break;

                }
                    
                
            }
        }
    }
}
