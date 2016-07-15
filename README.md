# The Gazelle

This code is written for [The Gazelle](http://thegazelle.org) website. The Gazelle is New York University Abu Dhabi's (NYUAD) independent  student news publication. The Gazelle's website is developed and maintained entirely by NYUAD students. The publication is managed by a dedicated team of writers, editors, artists, developers, and photographers and released weekly to the NYUAD, NYU global network, and greater Abu Dhabi communities every Sunday morning.

The Gazelle's website was redesigned from the ground up during the 2015-2016 academic year. We are aiming to have the new Gazelle website up and running by the start of the Fall 2016 semester.

## Resources

- [React](https://facebook.github.io/react/) for UI Rendering
- [React Router](https://github.com/reactjs/react-router) for App Routing
- [Falcor](https://github.com/Netflix/falcor) for Data Fetching
- [Express](https://expressjs.com/) for Server Side Rendering
- [Webpack](https://webpack.github.io/) for Building ES6 with Babel 6
- [Ghost](https://api.ghost.org/) for a RESTful JSON API and CMS
- [Airbnb Style Guide](https://github.com/airbnb/javascript/tree/master/react) for style consistency and linting

## Development

For technical documentation, see our [wiki](https://github.com/thegazelle-ad/gazelle-front-end/wiki) page. To get the site up and running locally, check out the [setting up](https://github.com/thegazelle-ad/gazelle-front-end/wiki/Setting-Up) page.

## Join the Herd

The Gazelle's website is managed by a team of dedicated student web developers. If you'd like to be part of the development team or any other aspect of The Gazelle, shoot an email to <*humans@thegazelle.org or some Gazelle email address like that*>.

## License

The MIT License

Copyright (c) 2016 The Gazelle

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

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
