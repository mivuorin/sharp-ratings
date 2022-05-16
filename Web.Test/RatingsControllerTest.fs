namespace Web.Test

open System
open System.Linq
open Microsoft.AspNetCore.Mvc
open Microsoft.EntityFrameworkCore
open Microsoft.EntityFrameworkCore.Diagnostics
open NUnit.Framework
open FsUnit

open SharpRatings.Web
open SharpRatings.Web.Controllers
open SharpRatings.Web.Database

module RatingsControllerTest =

    // TODO Encapsulate creating/cleaning up test data context with some fancy IDisposable implementation
    let createContext () : SharpRatingsDataContext =
        // Unique name makes sure that tests are not sharing same in memory context
        let name = Guid.NewGuid().ToString()

        let options =
            DbContextOptionsBuilder<SharpRatingsDataContext>()
                .UseInMemoryDatabase(name)
                .ConfigureWarnings(fun b ->
                    b.Ignore(InMemoryEventId.TransactionIgnoredWarning)
                    |> ignore)
                .Options

        new SharpRatingsDataContext(options)

    let deleteDatabase (context: SharpRatingsDataContext) : unit =
        context.Database.EnsureDeleted() |> ignore

    [<SetUp>]
    let Setup () = ()

    [<Test>]
    let Get_return_ratings_from_context () =
        use context = createContext ()
        let controller = context |> RatingsController

        let first = Rating.create "first-title" "first-body"

        let second =
            Rating.create "second-title" "second-body"

        context
        |> Repository.add first
        |> Repository.add second
        |> Repository.save
        |> ignore

        controller.Get()
        |> Seq.toList
        |> List.length
        |> should equal 2

        deleteDatabase context

    [<Test>]
    let Post_creates_new_rating () =
        use context = createContext ()
        let controller = context |> RatingsController

        let request =
            { Title = "test-title"
              Body = "test-body" }

        controller.Post(request)
        |> should be instanceOfType<OkResult>

        let actual = context.Ratings.First()
        actual.Id |> should not' (equal Guid.Empty)
        actual.Title |> should equal request.Title
        actual.Body |> should equal request.Body

        deleteDatabase context

    [<Test>]
    let Is_api_controller () =
        Attribute.IsDefined(typeof<RatingsController>, typeof<ApiControllerAttribute>)
        |> should equal true

