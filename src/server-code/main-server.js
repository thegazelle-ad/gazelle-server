/* Falcor */
import FalcorServer from 'falcor-express';
import falcor from 'falcor';

/* React */
// used to update the html <head>
import Helmet from 'react-helmet';
// components
import FalcorController from 'lib/falcor/FalcorController';

/* React Router */
// Serverside rendering functions
import { match } from 'react-router';
// Our custom routes for thegazelle.org
import routes from 'routes/main-routes';

/* Express Server Software */
import express from 'express';

/* Helper libraries */
import _ from 'lodash';
import compression from 'compression';
import path from 'path';

// Used for parsing post requests
import bodyParser from 'body-parser';

// Our custom config
import { getConfig } from '../config';

import { logger } from 'lib/logger';

/* Our helper functions */
import {
  isStaging,
  isCI,
  isDevelopment,
  isProduction,
  nothingAllowedRobotsTxt,
  allAllowedRobotsTxt,
} from 'lib/utilities';
import { md5Hash } from 'lib/server-utilities';

export default function runMainServer(serverFalcorModel) {
  // Create MD5 hash of static files for better cache performance
  let clientScriptHash = md5Hash(
    path.join(__dirname, '../../static/build/main-client.js'),
  );
  let cssHash = md5Hash(path.join(__dirname, '../../static/build/main.css'));

  // openGraphInfo is an array of objects with keys property and content such as
  // { property: 'og:image', content 'https://www.images.com/some/image' }
  const buildHtmlString = (body, cache, openGraphInfo) => {
    if (isDevelopment()) {
      // If it's development we know that the scripts may change while the server is running
      // and we can afford the computational cost of recomputing hashes. This allows us to just
      // refresh the browser instead of having to restart the server in production on the
      // other hand we assume the script won't change and don't want to compute the hash on
      // every server side render
      clientScriptHash = md5Hash(
        path.join(__dirname, '../../static/build/main-client.js'),
      );
      cssHash = md5Hash(path.join(__dirname, '../../static/build/main.css'));
    }

    const openGraphMetaTags = openGraphInfo
      ? openGraphInfo.reduce(
          (tagString, currentValue) =>
            `${tagString}<meta property="${currentValue.property}" content="${
              currentValue.content
            }" data-react-helmet="true">`, // We add this so React Helmet overwrites it
          '',
        )
      : '';

    const head = Helmet.rewind();

    return `<!DOCTYPE html>
        <html>
          <head>
            ${head.title}
            <link rel="stylesheet"
              type="text/css" href="/static/build/main.css?h=${cssHash}">
            <link rel="icon" type="image/x-icon" href="https://thegazelle.s3.amazonaws.com/gazelle/2016/02/favicon.ico">
            <link rel="apple-touch-icon" sizes="180x180" href="https://thegazelle.s3.amazonaws.com/gazelle/2016/02/apple-touch-icon.png">
            <link rel="icon" type="image/png" href="https://thegazelle.s3.amazonaws.com/gazelle/2016/02/favicon-32x32.png" sizes="32x32">
            <link rel="icon" type="image/png" href="https://thegazelle.s3.amazonaws.com/gazelle/2016/02/favicon-16x16.png" sizes="16x16">
            <link rel="manifest" href="https://s3.amazonaws.com/thegazelle/favicons/manifest.json">
            <link rel="mask-icon" href="https://s3.amazonaws.com/thegazelle/favicons/safari-pinned-tab.svg" color="#5bbad5">
            <meta name="theme-color" content="#ffffff">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            ${openGraphMetaTags}
            ${head.meta}
          </head>
          <body>
            <div id="main">${body}</div>
            <script>
              var _initialCache = ${JSON.stringify(cache)};
            </script>
            <script src="/static/build/main-client.js?h=${clientScriptHash}"></script>
          </body>
        </html>`;
  };

  // Asynchronously render the application
  // Returns a promise
  const renderApp = async renderProps => {
    let falcorPaths = _.compact(
      renderProps.routes.map(route => {
        const { component } = route;
        if (component.prototype instanceof FalcorController) {
          const pathSets = component.getFalcorPathSets(
            renderProps.params,
            renderProps.location.query,
          );
          if (!(pathSets instanceof Array) || pathSets.length === 0) {
            return null;
          }
          return pathSets;
        }
        return null;
      }),
    );

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
    const localModel = new falcor.Model({
      source: serverFalcorModel.asDataSource(),
    });

    const graphInfos = await Promise.all(
      renderProps.routes.map(async route => {
        const { component } = route;
        // We use the most specific one always, which means if we find a component with the getOpenGraphInformation
        // static method on it later in the components array we simply overwrite
        if (component.getOpenGraphInformation) {
          const pathSets = component.getFalcorPathSets(
            renderProps.params,
            renderProps.location.query,
          );
          const falcorResponse =
            pathSets[0] instanceof Array
              ? await serverFalcorModel.get(...pathSets)
              : await serverFalcorModel.get(pathSets);

          return component.getOpenGraphInformation(
            renderProps.params,
            falcorResponse.json,
          );
        }
        return null;
      }),
    );

    const filteredGraphInfos = graphInfos.filter(x => x);
    // Only take the most specific one, which is the last one
    const openGraphInfo = filteredGraphInfos.pop();

    // If the component doesn't want any data
    if (
      !falcorPaths ||
      falcorPaths.length === 0 ||
      (falcorPaths[0].length === 0 && falcorPaths.length === 1)
    ) {
      return new Promise(resolve => {
        resolve(buildHtmlString('', localModel.getCache(), openGraphInfo));
      });
    }

    return localModel
      .preload(...falcorPaths)
      .then(() => buildHtmlString('', localModel.getCache(), openGraphInfo));
  };

  // The Gazelle website server
  const app = express();

  // For post requests to go through correctly
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(
    '/model.json',
    FalcorServer.dataSourceRoute(() => serverFalcorModel.asDataSource()),
  );

  app.use('/static', express.static('static'));

  app.use(compression());

  // This endpoint is purely used so outsiders like CircleCI can know whether the server is running
  app.get('/alive', (req, res) => {
    res
      .status(200)
      .send(
        "This route is purely for internal testing, if you're seeing this in your browser" +
          ' you should instead navigate to <a href="/">The Front Page</a> to access' +
          ' the contents of our lovely newspaper.',
      );
  });

  if (isStaging()) {
    app.get('/robots.txt', (req, res) => {
      res
        .status(200)
        .type('txt')
        .send(nothingAllowedRobotsTxt);
    });
  } else if (isProduction()) {
    app.get('/robots.txt', (req, res) => {
      res
        .status(200)
        .type('txt')
        .send(allAllowedRobotsTxt);
    });
  }

  app.get('*', (req, res) => {
    match(
      { routes, location: req.url },
      (error, redirectLocation, renderProps) => {
        if (error) {
          res.status(500).send(error.message);
        } else if (redirectLocation) {
          res.redirect(
            302,
            redirectLocation.pathname + redirectLocation.search,
          );
        } else if (renderProps) {
          renderApp(renderProps, true)
            .then(html => {
              res.status(200).send(html);
            })
            .catch(err => {
              logger.error('Failed to render: ', req.url);
              logger.error(err.stack || err);
              if (getConfig().NODE_ENV !== 'production') {
                res.status(500).send(err.stack || err);
              } else {
                res
                  .status(500)
                  .send(
                    'There was an error while serving you this webpage.' +
                      ' Please contact The Gazelle team and tell them this link is broken. We hope' +
                      ' to fix it soon. Thank you.',
                  );
              }
            });
        } else {
          res.status(404).send('Not Found');
        }
      },
    );
  });

  const port = isCI() ? 3000 : getConfig().MAIN_PORT;
  app.listen(port, err => {
    if (err) {
      logger.error(err);
      return;
    }

    logger.debug(`The Gazelle Website started on port ${port}`);
  });
}
