# Minimal React Starter Kit

Intended to be as simple as small as possible for the advertised features:

Features:
- React for UI Rendering
- Falcor for Data Fetching
- Express for Server Side Rendering
- React Router
- Webpack building ES6 with Babel 6
- Hot Reloading

# License

Licensed under the MIT License.

# Install

Make sure you have NodeJS and npm installed

[https://nodejs.org/en/download/package-manager/](Install nodejs and npm)

Then install dependencies locally

```
npm install
```

# Run build tool

For single build

```
./node_modules/.bin/webpack
```

Or in watch mode (for active development)

```
./node_modules/.bin/webpack -w
```

Or a production build, (in case you want to deploy)

```
./node_modules/.bin/webpack -p
```

You will find the results in the ./build/ folder (not pushed to git)

Make sure to keep watching the build window, in case there is
a syntax error or something else preventing builds. Your code will not
recompile if there are build errors

# Run server

You need to re-run the server to isomorphically serve the latest
version. However, if you are just changing frontend, you can choose
to not restart the server on change, and the frontend code will still
be up to date time. The isomorphism will be broken, but it's not
important for development.

```
node build/server.js
```

Make sure you turn off browser caching. There's an option in Chrome
dev tools to do this.

# Isomorphism

This is served isomorphically. That means the initial render is 
on the server, then the identical code is served to the client, and
the web browser client does subsequent renders. If you want to know
more about what isomorphism is, here's an article that might help:

[https://www.lullabot.com/articles/what-is-an-isomorphic-application](What is an isomorphic application?)

# Note on linters

To make sure your linter uses the plugins here, either change the lint command
to run from ./node_modules/.bin/eslint or install all the eslint modules
using npm globally. Like:

```
sudo npm install -g eslint
sudo npm install -g eslint-import-resolver-webpack
... etc (look inside node_modules to see relevant ones)
```
