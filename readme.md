# SharpRatings

Learning project for Svelte and Asp.Net Core powered by F#.

## Tech:

* .Net 6 / Asp.Net Core / Svelte / Node

## How to build:

Svelte client needs to be built before building asp.net app. All client code is in `client` folder and build result will
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

To make development easier have building client in separate build task in ``Wen.fsproj` file:

```xml

<Target Name="Rollup" BeforeTargets="Build">
  <Exec Command="npm run build" WorkingDirectory="client" ConsoleToMSBuild="true" />
</Target>
```

Also automatically client files as part of the project. This does not work so well in Rider because file order matters
in F# projects so it would probably be easier to have client code separated from .Net project.

```xml

<ItemGroup Label="Client">
  <Content Include="client\**\*.js" />
  <Content Include="client\**\*.svelte" />
  <Content Remove="client\node_modules\**" />
</ItemGroup>
```

## Svelte & Rollup

Rollup is used for transpiling and bundling client side code into js file which is server by Asp.Net.

npm install --save-dev svelte rollup rollup-plugin-svelte @rollup/plugin-commonjs @rollup/plugin-node-resolve

Create rollup configuration `rollup.config.js``:
Build output is going to Asp.Net static wwwroot folder where we are serving bundled js.
`plugin-node-resolve` and `plugin-commonjs` are used to bundle 3rd party libraries and modules which might be in ES6 or
CommonJS syntax.

```javascript
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/main.js',
  output: {
    file: '../wwwroot/js/bundle.js',
    format: 'iife',
    name: 'app',
  },
  plugins: [
    commonjs(),
    resolve({ browser: true }),
    svelte({
      emitCss: false,
      compilerOptions: {
        customElement: false,
      },
    }),
  ],
};
```

> :warning: Make sure to add module resolver plugins before svelte plugin, otherwise importing dependencies won't work in Svelte components.

> :warning: Svelte plugins `include` option is explicit, if you set it and do not also add `node_modules` folder then imported .svelte components are not transpiled.

## Testing with Jest

Jest test can be run `rollup-jest` rollup plugin.

    npm install --save-dev jest rollup-jest

Using preset configuration for jest in `package.json`

```json
{
  "jest": {
    "preset": "rollup-jest"
  }
}
```

Svelte components needs to be precompiled for jest tests with `svelte-jester` jest plugin

    npm install --save-dev svelte-jester

Configure jest to preprocess svelte components

```json
{
  "jest": {
    "transform": {
      "^.+\\.svelte$": "svelte-jester"
    },
    "moduleFileExtensions": [
      "js",
      "svelte"
    ]
  }
}
```

Svelte components can be tested with `testing-library` svelte extension

    npm install --save-dev @testing-library/svelte

Also add Jest DOM matchers which help in writing clean tests

    npm install --save-dev @testing-library/jest-dom

Configure jest to use dom matchers

```json
{
  "setupFilesAfterEnv": [
    "@testing-library/jest-dom/extend-expect"
  ]
}
```

### rollup-jest plugin caused jest mocks to fail in Svelte components

For some reason Jest was not able to mock dependencies in Svelte components when it was transpiled with rollup-jest
plugin. Mocks in normal ES6 modules worked fine. This might had something to do with how jest.mock calls needs to
reorder imports or something.

Solution to the problem was to switch from `jest-rollup` to `jest-babel`.

npm install --save-dev @babel/core @babel/preset-env @babel/plugin-transform-runtime

Babel 7 needs also `plugin-transform-runtime` to avoid `ReferenceError: regeneratorRuntime is not defined` error.

Add following babel configuration `.babelrc` with env preset:

```json
{
  "presets": [
    "@babel/preset-env"
  ],
  "plugins": [
    "@babel/plugin-transform-runtime"
  ]
}
```

Configure Jest to use `babel-jest` when transforming js files:

```json
{
  "transform": {
    "^.+\\.svelte$": "svelte-jester",
    "^.+\\.jsx?$": "babel-jest"
  }
}
```

## Mocking fetch

Use [jest-fetch-mock](https://github.com/jefflau/jest-fetch-mock) to automatically mock fetch function.

    npm install --save-dev jest-fetch-mock

By default `jest-fetch-mock` enables mocks which needs to be reset after each test. Currently `jest-fetch-mocks` readme
advices to disable automatic mock reset from jest and explicitly reset mocks after each tests run. This can lead
problems when mocks share state across tests, when resetting mocks has been forgotten from individual test and also
extra code.

It's better to make jest reset mocks after each test.

Fetch mock needs to be initialized before loading jest environment, in `jest.setup.js`

```js
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();
```

To allow `jest-fetch-mock` to work with automatic mock resetting, it needs to be enabled before each test. This can be
done in jest after env setup file: `jest.setupAfterEnv.js`

    import fetchMock from "jest-fetch-mock";

    beforeEach(() => {
      fetchMock.doMock()
    })

And configure jest to use global setup file

```json
{
  "jest": {
    "automock": false,
    "resetMocks": true,
    "setupFiles": [
      "./jest.setup.js"
    ],
    "setupFilesAfterEnv": [
      "./jest.setupAfterEnv.js"
    ]
  }
}
```

## Testing library user events

When testing user interaction with form components, there is much more happening than just firing simple click events.
Using 'user-event' library makes firing user interaction events simpler.

    npm install --save-dev @testing-library/user-event

## ESLint & Prettier

For static code analysis install ESLint and Prettier for formatting. Configure ESLint to fail if code is not formatted
correctly with prettier.

    npm install --save-dev prettier eslint eslint-config-prettier eslint-plugin-prettier

Create ESLint configuration file according to your project. Styles can be ignored because we are using prettier for
that.

```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": "prettier",
  "plugins": [
    "eslint:recommended",
    "prettier"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "prettier/prettier": [
      "error"
    ]
  }
}    
```

Running eslint:

    npx eslint .

Running prettier:

    npx prettier -c .

Automatically formatting code with prettier:

    npx prettier -fix .

### Prettier on Windows

Prettier forced LF line endings in 2.0 version, which will cause problems if running with git `core.autocrlf=true`
setting on Windows OS. Every time checking out code git will convert LF to CRLF and fail linter and forcing line endings
to LF can cause other problems in Windows, so best to allow them locally. Make sure you still commit LF line endings!

We also prefer single quote string literals in js, personal opinion. Create following Prettier configuration
file `.prettierrc.json`

```json
{
  "endOfLine": "auto",
  "singleQuote": true
}
```

### ESLint: Jest

For linting test files add `eslint-plugin-jest` plugin.

    npm install --save-dev eslint-plugin-jest

Configure recommended rules or all rules.

```json
{
  "extends": [
    "plugin:jest/recommended"
  ],
  "plugins": [
    "jest"
  ]
}
```

### ESLint: testing library rules

Add following plugins to enforce good testing library use.

    npm install -D eslint-plugin-testing-library eslint-plugin-jest-dom

Configure ESLint:

```json
{
  "extends": [
    "plugin:testing-library/dom"
  ],
  "plugins": [
    "testing-library",
    "jest-dom"
  ]
}
``` 

### ESLint: Svelte

Add following plugin for linting Svelte components.

    npm install --save-dev eslint-plugin-svelte3

Configure ESLint Svelte plugin and add processing override for Svelte component files.

```json
{
  "plugins": [
    "svelte3"
  ],
  "overrides": [
    {
      "files": [
        "**/*.svelte"
      ],
      "processor": "svelte3/svelte3"
    }
  ]
}
```

Include Svelte component file extension when running linter.

    eslint . --ext .js,.svelte

> :warning: **`prettier-plugin-svelte` does not work with `eslint-prettier-plugin`**!!!
> It is better to keep ESLint separated from prettier and use `npx prettier . -c` command to check if there is formatting errors.

### Prettier: Svelte

Add following plugin to Prettier for formatting Svelte components.

    npm install --save-dev prettier-plugin-svelte

Configure file override for Svelte components.

```json
{
  "plugins": [
    "svelte3"
  ],
  "overrides": [
    {
      "files": [
        "*.svelte"
      ],
      "processor": "svelte3/svelte3"
    }
  ]
}
```

Add .svelte component extension when running ESLint.

    eslint . --ext .js,.svelte

## Form validation with svelte-form-lib and yup

Svelte-form-lib provides nice abstraction for handling form state and it integrates with yup validation library.

    npm install --save svelte-forms-lib yup

## Svelte Material UI

[Svelte Material UI](https://sveltematerialui.com/) is Svelte implementation of Googles CSS framework. SMUI library
components are split in separate npm packages to decrease project bundle size.

Each component needs to be individually added into project. eg.

    npm install --save-dev @smui/button
    npm install --save-dev @smui/top-app-bar
    ...

Material UI comes with them support and separate theme builder.

    npm install --save smui-theme

Create default theme from template.

    npx smui-theme template src/theme 

This theme needs to be compiled every time component is added or removed, so good place to add is as `prepare` npm script.

```json
{
  "scripts": {
    "dev": "rollup -c -w",
    "prepare": "smui-theme compile ../wwwroot/smui.css -i src/theme"
  }
}
```


//      "^.+\\.(css|less|scss)$": "babel-jest"
# Reference links

* Svelte docs - https://svelte.dev/docs
* Svelte Recipes - https://svelte-recipes.netlify.app/
* Rollup - https://rollupjs.org/guide/en/
* Rollup plugin svelte - https://github.com/sveltejs/rollup-plugin-svelte
* Rollup jest - https://github.com/ambar/rollup-jest
* Svelte jester - https://github.com/mihar-22/svelte-jester
* Svelte Testing Library - https://testing-library.com/docs/svelte-testing-library/intro/
* Jest DOM matchers for Testing Library - https://github.com/testing-library/jest-dom
* Svelte preprocessor for using other languages than JS - https://github.com/sveltejs/svelte-preprocess

# TODO List

* Move building client out from asp.net web project build to speed up building. No need to build client when building
  backend for tests.
* Move jest configuration to separate config file from packages.config to make things cleaner
* Figure out why Rider shows solution view shows multiple duplicate folders eg. client and src.
* Use generators for generating test data
* Wrap dbcontext into repository which would offer more functional api, so that method calls would not be needed to
  ignore
* Make web api asynchronous https://docs.microsoft.com/en-us/aspnet/core/web-api/action-return-types?view=aspnetcore-6.0
* Switch NUnit to XUnit which has better support for async tests https://github.com/xunit/xunit/issues/955
* Notification bar component which would show errors/warnings/success messages.
* Animations
* Trim post request strings with attribute or something.
* Separate client side form validation from component to make it easier to test.
* Move create rating into separate view.