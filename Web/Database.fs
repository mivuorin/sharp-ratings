namespace SharpRatings.Web.Database

open Microsoft.EntityFrameworkCore
open SharpRatings.Web.Database

type SharpRatingsDataContext(options) =
    inherit DbContext(options)

    [<DefaultValue>]
    val mutable ratings: DbSet<Rating>

    member this.Ratings
        with public get () = this.ratings
        and public set r = this.ratings <- r

    