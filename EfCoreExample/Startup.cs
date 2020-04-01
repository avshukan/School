using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using EfCoreLibrary;

namespace EfCoreExample
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services
                .AddMvcCore()
                .AddJsonFormatters()
                .AddJsonOptions(options => {
                    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                })
                .AddApiExplorer()
                .AddCors();

            services.AddSwaggerDocument();

            services
                .AddEntityFrameworkNpgsql()
                .AddDbContext<DatabaseContext>();
            
            services.AddSingleton<TestDatabaseContextOptionsBuilder>();

            services.AddScoped<SchoolService>();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
                app.UseDeveloperExceptionPage();

            app.UseCors(p => p
                .SetIsOriginAllowed(q => true)
                .AllowAnyMethod()
                .AllowCredentials()
                .AllowAnyHeader()
            );

            app.UseDefaultFiles();
            app.UseStaticFiles();
           
            app.UseMvc(routes => {
                routes.MapRoute("default", "{controller}/{action=Index}/{id?}");
            });

            app.UseOpenApi();
            app.UseSwaggerUi();
        }
    }
}
