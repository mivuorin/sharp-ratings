namespace SharpRatings.Web.Controllers

open System
open System.Collections.Generic
open System.ComponentModel.DataAnnotations
open Microsoft.AspNetCore.Mvc
open SharpRatings.Web
open SharpRatings.Web.Database

type RatingsResponse =
    { Id: Guid
      Title: string
      Body: string }

type CreateRatingRequest =
    { [<Required>]
      [<StringLength(140)>]
      Title: string
      [<Required>]
      Body: string }

[<ApiController>]
[<Route("api/[controller]")>]
type RatingsController(context: SharpRatingsDataContext) =
    inherit ControllerBase()

    [<HttpGet>]
    member _.Get() : IEnumerable<RatingsResponse> =
        query {
            for rating in context.Ratings do
                select
                    { Id = rating.Id
                      Title = rating.Title
                      Body = rating.Body }
        }

    [<HttpPost>]
    member _.Post(request: CreateRatingRequest) : ActionResult =
        let rating = Rating.create request.Title request.Body

        context
        |> Repository.add rating
        |> Repository.save
        |> ignore

        OkResult()
