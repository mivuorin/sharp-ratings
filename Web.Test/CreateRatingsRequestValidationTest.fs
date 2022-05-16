namespace Web.Test

open System
open System.ComponentModel.DataAnnotations
open NUnit.Framework
open FsUnit

open SharpRatings.Web.Controllers

module CreateRatingsRequestValidationTest =

    let whiteSpace = " \t\n"
    let empty = ""

    let string n =
        String('x', n)
        
    let isValid obj =
        let context = ValidationContext(obj)
        Validator.TryValidateObject(obj, context, ResizeArray<ValidationResult>(), true)

    [<Test>]
    let Valid () =
        { Title = "title"
          Body = "body" }
        |> isValid
        |> should equal true

    [<Test>]
    let Title_is_required () =
        { Title = empty; Body = "body" }
        |> isValid
        |> should equal false

    [<Test>]
    let Title_cannot_be_whitespace () =
        { Title = whiteSpace; Body = "body" }
        |> isValid
        |> should equal false
        
    [<Test>]
    let Body_is_required () =
        { Title = "title"; Body = empty }
        |> isValid
        |> should equal false

    [<Test>]
    let Body_cannot_be_whitespace () =
        { Title = "title"; Body = whiteSpace }
        |> isValid
        |> should equal false

    [<Test>]
    let Title_max_length_valid () =
        { Title = string 140; Body = "body" }
        |> isValid
        |> should equal true
        
    [<Test>]
    let Title_max_length_invalid () =
        { Title = string 141; Body = "body" }
        |> isValid
        |> should equal false
