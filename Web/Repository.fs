namespace SharpRatings.Web

open SharpRatings.Web.Database

// TODO Improve design and maybe inject context
// Add async version
module Repository =
    let add entity (context: SharpRatingsDataContext) =
        context.Add(entity) |> ignore
        context

    let save (context: SharpRatingsDataContext) = context.SaveChanges()
