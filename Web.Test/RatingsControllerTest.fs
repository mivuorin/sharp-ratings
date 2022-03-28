module Web.Test

open NUnit.Framework
open SharpRatings.Web.Controllers
open FsUnit

[<SetUp>]
let Setup () = ()

[<Test>]
let ShouldWork () =
    let controller = RatingsController()
    let ratings = controller.Get()
    ratings.Length |> should equal 2
