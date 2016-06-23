import FalcorServer from 'falcor-express';
import express from 'express';
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

// Allow node to use sourcemaps
sourcemap.install();


const buildHtmlString = (body, cache) => {
  return (
    `<!DOCTYPE html>
      <html>
        <head>
          <title>Hello World</title>
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
          <script src="/build/client.js"></script>
        </body>
      </html>`
  );
};

// Shared serverModel
// You can also hardcode / stub parts of the model here
const serverModel = new falcor.Model({
  cache: {
    pages: [
      {
        title: 'Page 0 title',
        body: 'Page 0 body',
      },
    ],
    articles: [
      {
        title: 'Article title',
        body: 'Article body',
      },
    ],
    authors: [
      {
        name: 'Author Name',
        biography: 'This is the biography of author x',
      },
    ],
  },
  source: new FalcorRouter(),
}).batch();

// Asynchronously render this application
// Returns a promise
const renderApp = (renderProps) => {
  const falcorPaths = _.compact(renderProps.routes.map((route) => {
    const component = route.component;
    if (component.prototype instanceof FalcorController) {
      return component.getFalcorPath(renderProps.params);
    }
    return null;
  }));

  // create a new model for this specific request
  // the reason we do this is so that the serverModel
  // cache won't expire records we need during the unlikely
  // event of heavy concurrent and unique traffic
  // And also it creates the minimum set of data we can send down
  // to the client and reload on the falcor there
  const localModel = new falcor.Model({ source: serverModel.asDataSource() });

  console.log('FETCHING Falcor Paths:');
  console.log(falcorPaths);

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
        res.redirect(302, redirectLocation.pathname + redirectLocation.serach);
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
