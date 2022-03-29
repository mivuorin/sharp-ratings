namespace SharpRatings.Web

open Microsoft.AspNetCore.Builder
open Microsoft.Extensions.Hosting

open Microsoft.Extensions.DependencyInjection

open Microsoft.EntityFrameworkCore
open SharpRatings.Web.Database

module Program =
    let exitCode = 0

    [<EntryPoint>]
    let main args =
        let builder = WebApplication.CreateBuilder(args)

        builder
            .Services
            .AddDbContext<SharpRatingsDataContext>(fun builder ->
                builder.UseInMemoryDatabase("SharpRatings")
                |> ignore)
            .AddControllersWithViews()
            .AddRazorRuntimeCompilation()
        |> ignore

        let app = builder.Build()

        if (builder.Environment.IsDevelopment()) then
            app.UseDeveloperExceptionPage() |> ignore
        else
            app.UseHsts() |> ignore // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.

        app
            .UseHttpsRedirection()
            .UseStaticFiles()
            .UseRouting()
            .UseAuthorization()
            .UseEndpoints(fun endpoints ->
                endpoints.MapDefaultControllerRoute() |> ignore
                endpoints.MapControllers() |> ignore)
        |> ignore

        app.Run()

        exitCode
