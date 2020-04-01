using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EfCoreLibrary
{
    public class DatabaseContext: DbContext

    {
        public DatabaseContext(TestDatabaseContextOptionsBuilder builder) : base(builder.Options)
        {
        }

        public DbSet<Group> Groups { get; set; }
        public DbSet<Lesson> Lessons { get; set; }
        public DbSet<Mark> Marks { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public ILoggerFactory LoggerFactory { get; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Entity<Group>()
                .ToTable("Groups");

            modelBuilder
                .Entity<Lesson>()
                .ToTable("Lessons");

            modelBuilder
                .Entity<Mark>()
                .ToTable("Marks");

            modelBuilder
                .Entity<Student>()
                .ToTable("Students");

            modelBuilder
                .Entity<Teacher>()
                .ToTable("Teachers");


            modelBuilder
                .Entity<Mark>()
                .HasOne(p => p.Lesson)
                .WithMany(p => p.Marks)
                .HasForeignKey(p => p.LessonId);

            modelBuilder
                .Entity<Mark>()
                .HasOne(p => p.Student)
                .WithMany(p => p.Marks)
                .HasForeignKey(p => p.StudentId);

            modelBuilder
                .Entity<Lesson>()
                .HasOne(p => p.Teacher)
                .WithMany(p => p.Lessons)
                .HasForeignKey(p => p.TeacherId);

            modelBuilder
                .Entity<Student>()
                .HasOne(p => p.Group)
                .WithMany(p => p.Students)
                .HasForeignKey(p => p.GroupId);

            modelBuilder.Entity<Group>()
                .HasOne(p => p.Teacher)
                .WithMany(p => p.Groups)
                .HasForeignKey(p => p.TeacherId);
        }
    }
}
