import FalcorServer from 'falcor-express';
import express from 'express';
import React from 'react';
import falcor from 'falcor';
import _ from 'lodash';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import sourcemap from 'source-map-support';
import routes from 'lib/editor-routes';
import FalcorController from 'lib/falcor/FalcorController';
import FalcorRouter from 'lib/falcor/FalcorRouter';
import { injectModelCreateElement } from 'lib/falcor/falcorUtils';

// Allow node to use sourcemaps
sourcemap.install();


const buildHtmlString = (body, cache) => {
  return (
    `<!DOCTYPE html>
      <html style>
        <head>
          <title>Gazelle Editor Tools</title>
          <link rel="stylesheet" href="http://yui.yahooapis.com/pure/0.6.0/pure-min.css">
          <link rel="stylesheet" type="text/css" href="/editorStyles.css">
          <meta name="viewport" content="width=device-width, initial-scale=1">
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
          <script src="/build/editor-client.js"></script>
        </body>
      </html>`
  );
};

// Shared serverModel
// You can also hardcode / stub parts of the model here
const serverModel = new falcor.Model({
  /*cache: {
    articlesBySlug:articles,
    authorsBySlug:authors,
  },*/
  source: new FalcorRouter()
}).batch();

// Asynchronously render this application
// Returns a promise
const renderApp = (renderProps) => {
  let falcorPaths = _.compact(renderProps.routes.map((route) => {
    const component = route.component;
    if (component.prototype instanceof FalcorController) {
      return component.getFalcorPathSets(renderProps.params);
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

  // create a new model for this specific request
  // the reason we do this is so that the serverModel
  // cache won't expire records we need during the unlikely
  // event of heavy concurrent and unique traffic
  // And also it creates the minimum set of data we can send down
  // to the client and reload on the falcor there
  const localModel = new falcor.Model({ source: serverModel.asDataSource() });

  // If the component doesn't want any data
  if (!falcorPaths || falcorPaths.length === 0 || falcorPaths[0].length === 0 && falcorPaths.length === 1) {
    // console.log("NO PATHS WERE GIVEN");
    return new Promise((resolve) => {
      resolve (
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

server.use("/model.json", FalcorServer.dataSourceRoute((req, res) => {
  return serverModel.asDataSource()
}))
server.use(express.static("static"))

server.get('*', (req, res) => {
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
          if (err.stack) {
            console.error(err.stack);
          } else {
            console.error(err);
          }
          res.status(500).send(err.stack);
        });
      } else {
        res.status(404).send('Not Found');
      }
    });
});


server.listen(3000, err => {
  if (err) {
    console.error(err);
    return;
  }

  console.log('Server started on port 3000');
});
