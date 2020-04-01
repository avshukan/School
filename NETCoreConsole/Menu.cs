using EfCoreLibrary;
using System;

namespace NETCoreConsole
{
    class Menu
    {
        public static void PrintMenu()
        {
            Console.Clear();
            Console.WriteLine("Select an item:");
            Console.WriteLine("T - Teachers");
            Console.WriteLine("G - Groups");
            Console.WriteLine("S - Students");
            Console.WriteLine("L - Lessons");
            Console.WriteLine("M - Marks");
            Console.WriteLine("Press ESC for exit");
        }

        public static void PrintSubMenu(string title, IToStringForConsole[] items, string[] info, int count, string searchString, int page, int pagesCount)
        {
            Console.Clear();
            Console.WriteLine(title.ToUpper());
            if (string.IsNullOrEmpty(searchString))
                Console.WriteLine("Filter is empty.");
            else
                Console.WriteLine($"Filter is '{searchString}'");
            Console.WriteLine($"Found {count} {title.ToLower()}");
            Console.WriteLine($"Current page is {page} of {pagesCount}");
            foreach (var item in items)
                Console.WriteLine(item.ToStringForConsole());
            if (info.Length > 0)
            {
                Console.WriteLine("");
                foreach (string s in info)
                    Console.WriteLine(s);
            }
            Console.WriteLine("");
            if (page > 1)
                Console.WriteLine("PgUp - Previous page");
            if (page < pagesCount)
                Console.WriteLine("PgDn - Next page");
            Console.WriteLine("F - Filter");
            Console.WriteLine("S - Select");
            Console.WriteLine("C - Create");
            Console.WriteLine("U - Update");
            Console.WriteLine("D - Delete");
            Console.WriteLine("Press ESC for main menu");
        }

        public static ConsoleKey PrintMockSubMenu()
        {
            Console.Clear();
            Console.WriteLine("Sorry. This chapter is unavailable");
            Console.WriteLine("Press ESC for main menu");
            return Console.ReadKey().Key;
        }
    }
}
