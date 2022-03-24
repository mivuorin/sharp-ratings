# SharpRatings

Learning project for Svelte and Asp.Net Core powered by F#.

## Tech:

* .Net 6 / Asp.Net Core / Svelte / Node

## How to build:

Svelte client needs to be built before building asp.net app. All client code is in 'client' folder and bulid result will
be located in 'wwwroot' folder where asp.net is serving it. To manually build client:

    cd client
    npm install
    npm run build

Building client is automatically done in MsBuilds before build target.

## How to dev:

Asp.net pages are compiled at runtime so no need to restart server. Svelte supports hot reloading in watch mode which
can be enabled by running 'dev' npm script.

    client/npm run dev

## Asp.Net Core MVC + F#

Currently using traditional MVC to render views and ApiController for api. Looks like `dotnet-aspnet-codegenerator` is
not supported for F# so code scaffolding does not work.

## Testing with Jest

Jest test can be run 'rollup-jest' rollup plugin.

    npm install --save-dev jest rollup-jest

Using preset configuration for jest in 'package.json'

    "jest": {
      "preset": "rollup-jest"
    }

Svelte components needs to be precompiled for jest tests with 'svelte-jester' jest plugin

    npm install --save-dev svelte-jester

Configure jest to preprocess svelte components

    "jest": {
      "transform": {
        "^.+\\.svelte$": "svelte-jester"
      },
      "moduleFileExtensions": ["js", "svelte"]
    }

Svelte components can be tested with 'testing-library' svelte extension

    npm install --save-dev @testing-library/svelte

Also add Jest DOM matchers which help in writing clean tests

    npm install --save-dev @testing-library/jest-dom

Configure jest to use dom matchers

    "setupFilesAfterEnv": [
      "@testing-library/jest-dom/extend-expect"
    ]

    

# Reference links

* Svelte docs - https://svelte.dev/docs
* Rollup - https://rollupjs.org/guide/en/
* Rollup plugin svelte - https://github.com/sveltejs/rollup-plugin-svelte
* Rollup jest - https://github.com/ambar/rollup-jest
* Svelte jester - https://github.com/mihar-22/svelte-jester
* Svelte Testing Library - https://testing-library.com/docs/svelte-testing-library/intro/
* Jest DOM matchers for Testing Library - https://github.com/testing-library/jest-dom
* Svelte preprocessor for using other languages than JS - https://github.com/sveltejs/svelte-preprocess
