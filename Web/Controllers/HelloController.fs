namespace SharpRatings.Web.Controllers

open Microsoft.AspNetCore.Mvc
open Microsoft.Extensions.Logging

[<ApiController>]
[<Route("api/[controller]")>]
type HelloController (logger : ILogger<HelloController>) =
    inherit ControllerBase()

    [<HttpGet>]
    member _.Get() =
        logger.LogInformation( "api/hello called!")
        "Hello from api!"