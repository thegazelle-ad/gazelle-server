/* Falcor */
import FalcorServer from 'falcor-express';
import falcor from 'falcor';

/* React */
import React from 'react';
import { renderToString } from 'react-dom/server';
// used to update the html <head>
import Helmet from 'react-helmet';
// components
import FalcorController from 'lib/falcor/FalcorController';

/* React Router */
// Serverside rendering functions
import { match, RouterContext } from 'react-router';
// Our custom routes for thegazelle.org
import mainRoutes from 'lib/routes';

/* Express Server Software */
import express from 'express';

/* Helper libraries */
import _ from 'lodash';
import compression from 'compression';
// Used for parsing post requests
import bodyParser from 'body-parser';

/* Our helper functions */
import { isStaging } from 'lib/utilities';
import { md5Hash } from 'lib/server-utilities';
import { injectModelCreateElement } from 'lib/falcor/falcor-utilities';


export default function runGazelleServer(serverFalcorModel) {
  // Create MD5 hash of static files for better cache performance
  const clientScriptHash = md5Hash('./static/build/client.js');
  const cssHash = md5Hash('./static/build/main.css');

  const buildHtmlString = (body, cache) => {
    const head = Helmet.rewind();

    return (
      `<!DOCTYPE html>
        <html>
          <head>
            ${head.title}
            <link rel="stylesheet"
              type="text/css" href="/static/build/main.css?h=${cssHash}">
            <link rel="icon" type="image/x-icon" href="https://thegazelle.s3.amazonaws.com/gazelle/2016/02/favicon.ico">
            <link rel="apple-touch-icon" sizes="180x180" href="https://thegazelle.s3.amazonaws.com/gazelle/2016/02/apple-touch-icon.png">
            <link rel="icon" type="image/png" href="https://thegazelle.s3.amazonaws.com/gazelle/2016/02/favicon-32x32.png" sizes="32x32">
            <link rel="icon" type="image/png" href="https://thegazelle.s3.amazonaws.com/gazelle/2016/02/favicon-16x16.png" sizes="16x16">
            <link rel="manifest" href="/favicons/manifest.json">
            <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#5bbad5">
            <meta name="theme-color" content="#ffffff">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            ${head.meta}
          </head>
          <body>
            <div id="main">${body}</div>
            <script>
              var _initialCache = ${JSON.stringify(cache)};
            </script>
            <script src="/static/build/client.js?h=${clientScriptHash}"></script>
          </body>
        </html>`
    );
  };

  // Asynchronously render the application
  // Returns a promise
  const renderApp = (renderProps) => {
    let falcorPaths = _.compact(renderProps.routes.map((route) => {
      const component = route.component;
      if (component.prototype instanceof FalcorController) {
        const pathSets = component.getFalcorPathSets(
          renderProps.params,
          renderProps.location.query
        );
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
      currentPathSets.push(nextPathSet);
      return currentPathSets;
    }, []);

    // create a new model for this specific request
    // the reason we do this is so that the serverFalcorModel
    // cache won't expire records we need during the unlikely
    // event of heavy concurrent and unique traffic
    // And also it creates the minimum set of data we can send down
    // to the client and reload on the falcor there
    const localModel = new falcor.Model({ source: serverFalcorModel.asDataSource() });

    // If the component doesn't want any data
    if (
      !falcorPaths ||
      falcorPaths.length === 0 ||
      falcorPaths[0].length === 0 &&
      falcorPaths.length === 1
    ) {
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

    return localModel.preload(...falcorPaths).then(() => (
      buildHtmlString(
        renderToString(
          <RouterContext
            createElement={injectModelCreateElement(localModel)}
            {...renderProps}
          />
        ),
        localModel.getCache()
      )
    ));
  };

  // The Gazelle website server
  const app = express();

  // For post requests to go through correctly
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/model.json', FalcorServer.dataSourceRoute(() => (
    serverFalcorModel.asDataSource()
  )));

  app.use('/static', express.static('static'));

  app.use(compression());

  // This endpoint is purely used so outsiders like CircleCI can know whether the server is running
  app.get('/alive', (req, res) => {
    res.status(200).send(
      'This route is purely for internal testing, if you\'re seeing this in your browser' +
      ' you should instead navigate to <a href="/">The Front Page</a> to access' +
      ' the contents of our lovely newspaper.'
    );
  });

  if (isStaging) {
    app.get('/login', (req, res) => {
      match({ routes: mainRoutes, location: req.url },
        (error, redirectLocation, renderProps) => {
          if (error) {
            res.status(500).send(error.message);
          } else if (redirectLocation) {
            res.redirect(302, redirectLocation.pathname + redirectLocation.search);
          } else if (renderProps) {
            renderApp(renderProps, true).then((html) => {
              res.status(200).send(html);
            }).catch((err) => {
              if (process.env.NODE_ENV !== 'production') {
                console.error('Failed to render: ', req.url); // eslint-disable-line no-console
                console.error(err.stack || err); // eslint-disable-line no-console
                res.status(500).send(err.stack || err);
              } else {
                res.status(500).send('There was an error while serving you this webpage.' +
                  ' Please contact The Gazelle team and tell them this link is broken. We hope' +
                  ' to fix it soon. Thank you.');
              }
            });
          } else {
            res.status(404).send('Not Found');
          }
        }
      );
    });
    app.get(/(?!\/login)/, (req, res) => {
      res.redirect(307, `/login?url=${req.url}`);
    });
  } else {
    app.get('*', (req, res) => {
      match({ routes: mainRoutes, location: req.url },
        (error, redirectLocation, renderProps) => {
          if (error) {
            res.status(500).send(error.message);
          } else if (redirectLocation) {
            res.redirect(302, redirectLocation.pathname + redirectLocation.search);
          } else if (renderProps) {
            renderApp(renderProps, true).then((html) => {
              res.status(200).send(html);
            }).catch((err) => {
              console.error('Failed to render: ', req.url); // eslint-disable-line no-console
              console.error(err.stack || err); // eslint-disable-line no-console
              if (process.env.NODE_ENV !== 'production') {
                res.status(500).send(err.stack || err);
              } else {
                res.status(500).send('There was an error while serving you this webpage.' +
                  ' Please contact The Gazelle team and tell them this link is broken. We hope' +
                  ' to fix it soon. Thank you.');
              }
            });
          } else {
            res.status(404).send('Not Found');
          }
        }
      );
    });
  }

  // To start server with PORT=3000 default: run `npm start`
  // NOTE: On Linux systems, any port below 1024 requires root access (`sudo` command)
  // To run on port 80:
  //    Development build: run `sudo PORT=80 npm start`
  //    Production build: run `sudo npm start`
  app.listen(process.env.MAIN_PORT || 3000, err => {
    if (err) {
      console.error(err); // eslint-disable-line no-console
      return;
    }
    console.log( // eslint-disable-line no-console
      `The Gazelle Website started on port ${process.env.MAIN_PORT || 3000}`
    );
  });
}
