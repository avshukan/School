using Autofac;
using Microsoft.Extensions.Logging;
using System;
using EfCoreLibrary;

namespace NETCoreConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            var container = InitializeContainer();
            var teacherController = container.Resolve<TeacherController>();
            var lessonController = container.Resolve<LessonController>();
            ConsoleKey key = ConsoleKey.Spacebar;
            while (key != ConsoleKey.Escape)
            {
                Menu.PrintMenu();
                key = Console.ReadKey(true).Key;
                switch (key)
                {
                    case ConsoleKey.T:
                        teacherController.Run();
                        break;
                    case ConsoleKey.G:
                        Menu.PrintMockSubMenu();
                        break;
                    case ConsoleKey.S:
                        Menu.PrintMockSubMenu();
                        break;
                    case ConsoleKey.L:
                        lessonController.Run();
                        break;
                    case ConsoleKey.M:
                        Menu.PrintMockSubMenu();
                        break;
                }
            }
        }

        private static IContainer InitializeContainer()
        {
            var builder = new ContainerBuilder();
            builder.RegisterType<SchoolService>();
            builder.RegisterType<TestDatabaseContextOptionsBuilder>().SingleInstance();
            builder.RegisterType<DatabaseContext>();
            builder.RegisterType<LoggerFactory>().As<ILoggerFactory>();
            builder.RegisterType<TeacherController>();
            builder.RegisterType<LessonController>();
            
            return builder.Build();
        }
    }
}
