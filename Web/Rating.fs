namespace SharpRatings.Web.Database

open System

[<CLIMutable>]
type Rating =
    { Id: Guid
      Title: string
      Body: string }

module Rating =
    let create title body =
        { Title = title
          Body = body
          Id = Guid.NewGuid() }
