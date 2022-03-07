namespace SharpRatings.Web.Controllers

open Microsoft.AspNetCore.Mvc
open Microsoft.Extensions.Logging

type HomeController(logger : ILogger<HelloController>) =
    inherit Controller()

    member this.Index() =
        logger.LogInformation("Rendering index view.")
        this.View()
