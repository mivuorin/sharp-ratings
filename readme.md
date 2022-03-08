# SharpRatings

Learning project for Svelte and Asp.Net Core powered by F#.

## Tech:
* .Net 6 / Asp.Net Core / Svelte / Node

## How to build:

Svelte client needs to be built before building asp.net app. All client code is in 'client' folder and bulid result will be located in 'wwwroot' folder where asp.net is serving it.
To manually build client:

    cd client
    npm install
    npm run build

Building client is automatically done in MsBuilds before build target. 

## How to dev:

Asp.net pages are compiled at runtime so no need to restart server.
Svelte supports hot reloading in watch mode which can be enabled by running 'dev' npm script.

    client/npm run dev

## Asp.Net Core MVC + F# 

Currently using traditional MVC to render views and ApiController for api.
Looks like `dotnet-aspnet-codegenerator` is not supported for F# so code scaffolding does not work.