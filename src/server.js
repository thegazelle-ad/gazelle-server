import FalcorServer from 'falcor-express';
import express from 'express';
import compression from 'compression';
import React from 'react';
import falcor from 'falcor';
import _ from 'lodash';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import sourcemap from 'source-map-support';
import routes from 'lib/routes';
import FalcorController from 'lib/falcor/FalcorController';
import FalcorRouter from 'lib/falcor/FalcorRouter';
import { injectModelCreateElement } from 'lib/falcor/falcorUtils';
import path from "path";
import crypto from "crypto";
import fs from "fs"
import Helmet from "react-helmet";

// *********************************************
// Load in static issue articles for development
// *********************************************
//import testData from '../static/sample-issue/posts.js';
//import authors from '../static/sample-issue/authors.js';

// Allow node to use sourcemaps

if (process.env.NODE_ENV !== "production") {
  sourcemap.install();
}

// Create MD5 hash of static file for better cache performance
function md5Hash(file) {
  const hash = crypto.createHash('md5');
  // readFileSync in the syncronous version of readFile
  file = fs.readFileSync(file, 'utf8');
  return (hash.update(file).digest('hex'));
}


const buildHtmlString = (body, cache) => {

  let clientHash = md5Hash('./static/build/client.js');
  let cssHash = md5Hash('./static/build/main.css');

  let head = Helmet.rewind();

  return (
    `<!DOCTYPE html>
      <html>
        <head>
          ` + head.title + `
          <link rel="stylesheet" type="text/css" href="/static/build/main.css?h=` + cssHash + `">
          <link rel="icon" type="image/x-icon" href="https://thegazelle.s3.amazonaws.com/gazelle/2016/02/favicon.ico">
          <link rel="apple-touch-icon" sizes="180x180" href="https://thegazelle.s3.amazonaws.com/gazelle/2016/02/apple-touch-icon.png">
          <link rel="icon" type="image/png" href="https://thegazelle.s3.amazonaws.com/gazelle/2016/02/favicon-32x32.png" sizes="32x32">
          <link rel="icon" type="image/png" href="https://thegazelle.s3.amazonaws.com/gazelle/2016/02/favicon-16x16.png" sizes="16x16">
          <link rel="manifest" href="/favicons/manifest.json">
          <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#5bbad5">
          <meta name="theme-color" content="#ffffff">
          <meta name="viewport" content="width=device-width, initial-scale=1">`
            + head.meta +
          `
        </head>
        <body>
          <div id="main">`
            + body +
          `</div>
          <script>
            var _initialCache =
            ` + JSON.stringify(cache) + `
            ;
          </script>
          <script src="/static/build/client.js?h=` + clientHash + `"></script>
        </body>
      </html>`
  );
};

// Shared serverModel
// You can also hardcode / stub parts of the model here
const serverModel = new falcor.Model({
  source: new FalcorRouter(),
  // maxSize is 400 MB in production and 80 MB when in development or beta mode
  maxSize: process.env.NODE_ENV === "production" ? 400*1000*1000 : 80*1000*1000,
  collectRatio: 0.75,
}).batch();

// Asynchronously render this application
// Returns a promise
const renderApp = (renderProps) => {
  let falcorPaths = _.compact(renderProps.routes.map((route) => {
    const component = route.component;
    if (component.prototype instanceof FalcorController) {
      let pathSets = component.getFalcorPathSets(renderProps.params);
      if (!(pathSets instanceof Array) || pathSets.length === 0) {
        return null;
      }
      return pathSets;
    }
    return null;
  }));
  // Merging pathsets
  falcorPaths = falcorPaths.reduce((currentPathSets, nextPathSet) => {
    if (nextPathSet[0] instanceof Array) {
      return currentPathSets.concat(nextPathSet);
    }
    else {
      currentPathSets.push(nextPathSet);
      return currentPathSets;
    }
  }, []);

  // Merging pathsets
  var temp = [];
  falcorPaths.forEach((pathSet) => {
    if (pathSet[0] instanceof Array) {
      temp = temp.concat(pathSet);
    }
    else {
      temp.push(pathSet);
    }
  });
  falcorPaths = temp;

  // create a new model for this specific request
  // the reason we do this is so that the serverModel
  // cache won't expire records we need during the unlikely
  // event of heavy concurrent and unique traffic
  // And also it creates the minimum set of data we can send down
  // to the client and reload on the falcor there
  const localModel = new falcor.Model({ source: serverModel.asDataSource() });

  // If the component doesn't want any data
  if (!falcorPaths || falcorPaths.length === 0 || falcorPaths[0].length === 0 && falcorPaths.length === 1) {
    return new Promise((resolve) => {
      resolve(
        buildHtmlString(
          renderToString(
            <RouterContext
              createElement={injectModelCreateElement(localModel)}
              {...renderProps}
            />
          ),
          localModel.getCache()
        )
      );
    });
  }

  // Silenced Falcor path logs
  // console.log('FETCHING Falcor Paths:');
  // console.log(falcorPaths);

  return localModel.preload(...falcorPaths).then(() => {
    return (
      buildHtmlString(
        renderToString(
          <RouterContext
            createElement={injectModelCreateElement(localModel)}
            {...renderProps}
          />
        ),
        localModel.getCache()
      )
    );
  });
};

const server = express();

server.use("/model.json", FalcorServer.dataSourceRoute(() => {
  return serverModel.asDataSource()
}));

server.use("/static", express.static("static"));

server.use("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "./static"));
});

server.use(compression());

server.get('*', (req, res) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("GOT REQUEST");
  }
  match({ routes, location: req.url },
    (error, redirectLocation, renderProps) => {
      if (error) {
        res.status(500).send(error.message);
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        renderApp(renderProps).then((html) => {
          res.status(200).send(html);
        }).catch((err) => {
          console.error('Failed to render: ', req.url);
          console.error(err.stack || err)
          res.status(500).send(err.stack || err);
        });
      } else {
        res.status(404).send('Not Found');
      }
    });
});

// To start server with PORT=3000 default: run `npm start`
// NOTE: On Linux systems, any port below 1024 requires root access (`sudo` command)
// To run on port 80:
//    Development build: run `sudo PORT=80 npm start`
//    Production build: run `sudo npm start`
server.listen(process.env.PORT ? process.env.PORT : 3000, err => {
  if (err) {
    console.error(err);
    return;
  }
  process.env.NODE_ENV === "production" ?
    console.log("PRODUCTION BUILD") : process.env.NODE_ENV === "beta" ? console.log("BETA BUILD") : console.log("DEVELOPMENT BUILD");

  console.log('Server started on port ' + (process.env.PORT ? process.env.PORT : 3000));
});
