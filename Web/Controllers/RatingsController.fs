namespace SharpRatings.Web.Controllers

open Microsoft.AspNetCore.Mvc

type Rating = { Title: string; Body: string }

[<ApiController>]
[<Route("api/[controller]")>]
type RatingsController() =
    inherit ControllerBase()

    [<HttpGet>]
    member _.Get() =
        [ { Title = "Svelte"
            Body = "Svelte is nice component framework" }
          { Title = "F#"
            Body = "Great functional language" } ]
