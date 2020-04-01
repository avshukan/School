using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EfCoreLibrary
{
    public class TestDatabaseContextOptionsBuilder : DbContextOptionsBuilder<DatabaseContext>
    {
        public TestDatabaseContextOptionsBuilder(ILoggerFactory loggerFactory)
        {
            UseLoggerFactory(loggerFactory);
            this.UseNpgsql("Host=localhost;Port=5432;Username=postgres;Password=Poooctsavthi7;Database=SchoolDB");
        }
    }
}
