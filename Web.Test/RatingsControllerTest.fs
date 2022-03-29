namespace Web.Test

open Microsoft.EntityFrameworkCore
open Microsoft.EntityFrameworkCore.Diagnostics
open NUnit.Framework
open SharpRatings.Web.Controllers
open FsUnit
open SharpRatings.Web.Database


// TODO Improve design and maybe inject context
// Add async version
module Repository =
    let add entity (context:SharpRatingsDataContext) =
        context.Add(entity) |> ignore
        context
    
    let save (context:SharpRatingsDataContext) =
        context.SaveChanges()

module RatingsControllerTest =

    let dataContext () : SharpRatingsDataContext =
        let options =
            DbContextOptionsBuilder<SharpRatingsDataContext>()
                .UseInMemoryDatabase("test")
                .ConfigureWarnings(fun b ->
                    b.Ignore(InMemoryEventId.TransactionIgnoredWarning)
                    |> ignore)
                .Options

        new SharpRatingsDataContext(options)
    

    [<SetUp>]
    let Setup () = ()

    [<Test>]
    let Return_ratings_from_context () =
        use context = dataContext ()
        let controller = context |> RatingsController

        let first = Rating.create "first-title" "first-body"
        let second = Rating.create "second-title" "second-body"
        
        context
            |> Repository.add first
            |> Repository.add second
            |> Repository.save
            |> ignore
        
        controller.Get()
        |> Seq.toList
        |> List.length
        |> should equal 2
