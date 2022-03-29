namespace SharpRatings.Web.Controllers

open System
open System.Collections.Generic
open Microsoft.AspNetCore.Mvc
open SharpRatings.Web.Database
open Microsoft.EntityFrameworkCore
open System.Linq

type RatingsResponse =
    { Id: Guid
      Title: string
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
