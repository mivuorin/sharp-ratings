# SharpRatings

Learning project for Svelte and Asp.Net Core powered by F#.

## Tech:

* .Net 6 / Asp.Net Core / Svelte / Node

## How to build:

Svelte client needs to be built before building asp.net app. All client code is in `client` folder and bulid result will
be located in `wwwroot` folder where asp.net is serving it. To manually build client:

    cd client
    npm install
    npm run build

Building client is automatically done in MsBuilds before build target.

## How to dev:

Asp.net pages are compiled at runtime so no need to restart server. Svelte supports hot reloading in watch mode which
can be enabled by running `dev` npm script.

    client/npm run dev

## Asp.Net Core MVC + F#

Currently using traditional MVC to render views and ApiController for api. Looks like `dotnet-aspnet-codegenerator` is
not supported for F# so code scaffolding does not work.

## Testing with Jest

Jest test can be run `rollup-jest` rollup plugin.

    npm install --save-dev jest rollup-jest

Using preset configuration for jest in `package.json`

    "jest": {
      "preset": "rollup-jest"
    }

Svelte components needs to be precompiled for jest tests with `svelte-jester` jest plugin

    npm install --save-dev svelte-jester

Configure jest to preprocess svelte components

    "jest": {
      "transform": {
        "^.+\\.svelte$": "svelte-jester"
      },
      "moduleFileExtensions": ["js", "svelte"]
    }

Svelte components can be tested with `testing-library` svelte extension

    npm install --save-dev @testing-library/svelte

Also add Jest DOM matchers which help in writing clean tests

    npm install --save-dev @testing-library/jest-dom

Configure jest to use dom matchers

    "setupFilesAfterEnv": [
      "@testing-library/jest-dom/extend-expect"
    ]

## Mocking fetch

Use [jest-fetch-mock](https://github.com/jefflau/jest-fetch-mock) to automatically mock fetch function. 

    npm install --save-dev jest-fetch-mock

By default `jest-fetch-mock` enables mocks which needs to be reset after each test. Currently `jest-fetch-mocks` readme advices to disable automatic mock reset from jest and explicitly reset mocks after each tests run.
This can lead problems when mocks share state across tests, when resetting mocks has been forgotten from individual test and also extra code.

It's better to make jest reset mocks after each test.

Fetch mock needs to be initialized before loading jest environment, in `jest.setup.js`

    import fetchMock from "jest-fetch-mock";
    fetchMock.enableMocks();

To allow `jest-fetch-mock` to work with automatic mock resetting, it needs to be enabled before each test. This can be done in jest after env setup file: `jest.setupAfterEnv.js`

    import fetchMock from "jest-fetch-mock";

    beforeEach(() => {
      fetchMock.doMock()
    })

And configure jest to use global setup file

    "jest": {
        "automock": false,
        "resetMocks": true,
        "setupFiles": [
          "./jest.setup.js"
        ],
        "setupFilesAfterEnv": [
          "./jest.setupAfterEnv.js",
        ]
    }

# Reference links

* Svelte docs - https://svelte.dev/docs
* Rollup - https://rollupjs.org/guide/en/
* Rollup plugin svelte - https://github.com/sveltejs/rollup-plugin-svelte
* Rollup jest - https://github.com/ambar/rollup-jest
* Svelte jester - https://github.com/mihar-22/svelte-jester
* Svelte Testing Library - https://testing-library.com/docs/svelte-testing-library/intro/
* Jest DOM matchers for Testing Library - https://github.com/testing-library/jest-dom
* Svelte preprocessor for using other languages than JS - https://github.com/sveltejs/svelte-preprocess

# TODO List

* Move building client out from asp.net web project build to speed up building. No need to build client when building backend for tests.
* Add prettier & linter
* Move jest configuration to separate config file from packages.config to make things cleaner
* Figure out why Rider shows solution view shows multiple duplicate folders eg. client and src.
* Use generators for generating test data
* Wrap dbcontext into repository which would offer more functional api, so that method calls would not be needed to ignore
* Make web api asynchronous https://docs.microsoft.com/en-us/aspnet/core/web-api/action-return-types?view=aspnetcore-6.0