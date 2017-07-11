import FalcorServer from 'falcor-express';
import express from 'express';
import compression from 'compression';
import React from 'react';
import falcor from 'falcor';
import _ from 'lodash';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import sourcemap from 'source-map-support';
import mainRoutes from 'lib/routes';
import FalcorController from 'lib/falcor/FalcorController';
import FalcorRouter from 'lib/falcor/FalcorRouter';
import { injectModelCreateElement } from 'lib/falcor/falcorUtils';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import Helmet from 'react-helmet';
import bodyParser from 'body-parser';
import { exec } from 'child_process';
import { hash } from 'lib/utilities';
import multer from 'multer';
import s3Config from '../config/s3.config.js';
import s3 from 's3';
import AWS from 'aws-sdk';

if (process.env.NODE_ENV === 'production') {
  console.log('PRODUCTION BUILD'); // eslint-disable-line no-console
} else if (process.env.NODE_ENV === 'beta') {
  console.log('BETA BUILD'); // eslint-disable-line no-console
} else {
  console.log('DEVELOPMENT BUILD'); // eslint-disable-line no-console
}

// Allow node to use sourcemaps

if (process.env.NODE_ENV !== 'production') {
  sourcemap.install();
}

// Create MD5 hash of static file for better cache performance
function md5Hash(file) {
  const hashInstance = crypto.createHash('md5');
  // readFileSync in the syncronous version of readFile
  const fileContents = fs.readFileSync(file, 'utf8');
  return hashInstance.update(fileContents).digest('hex');
}

const mainClientHash = md5Hash('./static/build/client.js');
const mainCssHash = md5Hash('./static/build/main.css');

const buildMainHtmlString = (body, cache) => {
  const head = Helmet.rewind();

  return (
    `<!DOCTYPE html>
      <html>
        <head>
          ${head.title}
          <link rel="stylesheet"
            type="text/css" href="/static/build/main.css?h=${mainCssHash}">
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
          <div id="main">
          ${body}
          </div>
          <script>
            var _initialCache = ${JSON.stringify(cache)};
          </script>
          <script src="/static/build/client.js?h=${mainClientHash}"></script>
        </body>
      </html>`
  );
};

const editorClientHash = md5Hash('./static/build/editor-client.js');
const editorCssHash = md5Hash('./static/editorStyles.css');

const editorHtmlString = (
  `<!DOCTYPE html>
    <html>
      <head>
        <title>Gazelle Editor Tools</title>
        <link rel="stylesheet" href="/pure-min.css">
        <link rel="stylesheet" type="text/css" href="/editorStyles.css?h=${editorCssHash}">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <div id="main">
          loading...
        </div>
        <script src="/build/editor-client.js?h=${editorClientHash}"></script>
      </body>
    </html>`
);

// Shared serverModel
// You can also hardcode / stub parts of the model here
const serverModel = new falcor.Model({
  source: new FalcorRouter(),
  // maxSize is 400 MB in production and 80 MB when in development or beta mode
  maxSize: process.env.NODE_ENV === 'production' ? 400 * 1000 * 1000 : 80 * 1000 * 1000,
  collectRatio: 0.75,
}).batch();

// reset cache trending data every minute
// so we're sure that we always have up to date
// trending data available
function resetTrending() {
  serverModel.invalidate(['trending']);
}

setInterval(resetTrending, 60 * 1000);

// Asynchronously render this application
// Returns a promise
const renderApp = (renderProps) => {
  let falcorPaths = _.compact(renderProps.routes.map((route) => {
    const component = route.component;
    if (component.prototype instanceof FalcorController) {
      const pathSets = component.getFalcorPathSets(renderProps.params, renderProps.location.query);
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
  // the reason we do this is so that the serverModel
  // cache won't expire records we need during the unlikely
  // event of heavy concurrent and unique traffic
  // And also it creates the minimum set of data we can send down
  // to the client and reload on the falcor there
  const localModel = new falcor.Model({ source: serverModel.asDataSource() });

  // If the component doesn't want any data
  if (
    !falcorPaths ||
    falcorPaths.length === 0 ||
    falcorPaths[0].length === 0 &&
    falcorPaths.length === 1
  ) {
    return new Promise((resolve) => {
      resolve(
        buildMainHtmlString(
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
    buildMainHtmlString(
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

const mainApp = express();

// For post requests to go through correctly
mainApp.use(bodyParser.urlencoded({ extended: true }));

mainApp.use('/model.json', FalcorServer.dataSourceRoute(() => (
  serverModel.asDataSource()
)));

mainApp.use('/static', express.static('static'));

/* mainApp.use("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "./static"));
}); What is it this? What purpose does it have?*/

mainApp.use(compression());

if (process.env.NODE_ENV === 'beta') {
  mainApp.get('/login', (req, res) => {
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
  mainApp.get(/(?!\/login)/, (req, res) => {
    res.redirect(307, `/login?url=${req.url}`);
  });
} else {
  mainApp.get('*', (req, res) => {
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
mainApp.listen(process.env.MAIN_PORT ? process.env.MAIN_PORT : 3000, err => {
  if (err) {
    console.error(err); // eslint-disable-line no-console
    return;
  }
  console.log( // eslint-disable-line no-console
    `The Gazelle Website started on port ${process.env.MAIN_PORT ? process.env.MAIN_PORT : 3000}`
  );
});


// Editor tools server

const editorTools = express();

// This is for parsing post requests
editorTools.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
// For connecting the client to our falcor server
editorTools.use('/model.json', FalcorServer.dataSourceRoute(() => (
  serverModel.asDataSource()
)));
// serving static files
editorTools.use(express.static('static'));

const allowCrossDomain = function (req, res, next) { // eslint-disable-line func-names
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, ' +
      'Content-Length, X-Requested-With');
    res.send(200);
  } else {
    next();
  }
};

editorTools.use(allowCrossDomain);

let PATH_NAME;

if (process.env.NODE_ENV === 'production') {
  PATH_NAME = '~/gazelle-production/scripts/restartServers.sh';
} else if (process.env.NODE_ENV === 'beta') {
  PATH_NAME = '~/gazelle-beta/scripts/restartServers.sh';
} else {
  PATH_NAME = `${__dirname}/scripts/restartServers.sh`;
}

var isrestarted = false;

editorTools.get('/restartserver', (req, res) => {

  isrestarted = true;

  if (!process.env.NODE_ENV) {
<<<<<<< d3c8d13623aea3cbf13fcc99d1adbfcac89d2f09
    // in dev mode
    res.status(200).send('restarted');
=======
    //in dev mode
    res.status(200).send("restarted");
>>>>>>> Reset Server Button
    return;
  }

  const password = req.query.password;
<<<<<<< d3c8d13623aea3cbf13fcc99d1adbfcac89d2f09
  if ((typeof password) !== 'string' || password.length < 1) {
=======
  
  if ((typeof password) !== "string" || password.length < 1) {
>>>>>>> Reset Server Button
    res.status(401).send('invalid');
  } else if (hash(password) === 8692053) {
    exec(PATH_NAME, (err, stdout, stderr) => {
      res.status(200).send('start');
      if (err) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(err); // eslint-disable-line no-console
        }
        res.status(500).send('error');
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.log(stdout); // eslint-disable-line no-console
          console.log(stderr); // eslint-disable-line no-console
        }
      }
    });
  } else {
    res.status(401).send('invalid');
  }
});

<<<<<<< d3c8d13623aea3cbf13fcc99d1adbfcac89d2f09
const uploadDir = path.join(__dirname, '../tmp');
=======
editorTools.get('/isrestarted', (req, res) => {
  res.status(200).send(isrestarted);
});


const upload_dir = path.join(__dirname, '../tmp');
>>>>>>> Reset Server Button

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const awsSdkClient = new AWS.S3(
  Object.assign(s3Config, { apiVersion: '2006-03-01' })
);

const s3Client = s3.createClient({
  s3Client: awsSdkClient,
});

editorTools.post('/upload', upload.single('image'), (req, res) => {
  if (!process.env.NODE_ENV) {
    // We are in dev-mode, we don't actually want to upload to s3
    // you can either compile with production mode or remove this
    // temporarily if extra s3 tests are needed at some point
    setTimeout(() => {
      res.status(200).send('success on test url');
    }, 2000);
  } else {
    const filePath = req.file.path;
    const year = new Date().getFullYear().toString();
    let month = new Date().getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    } else {
      month = month.toString();
    }

    const Bucket = 'thegazelle';
    const Key = `gazelle/${year}/${month}/${req.file.originalname}`;
    const s3Params = {
      localFile: filePath,
      s3Params: {
        Bucket,
        Key,
      },
    };
    const deleteTmpFile = () => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err); // eslint-disable-line no-console
        }
      });
    };
    awsSdkClient.headObject({ Bucket, Key }, (err) => {
      if (err && err.code === 'NotFound') {
        const s3Uploader = s3Client.uploadFile(s3Params);
        s3Uploader.on('error', s3Err => {
          console.error(s3Err); // eslint-disable-line no-console
          deleteTmpFile();
          return res.status(500).send('Error uploading');
        });
        s3Uploader.on('end', () => {
          const imageUrl = s3.getPublicUrl(Bucket, Key);
          deleteTmpFile();
          return res.status(200).send(`success ${imageUrl}`);
        });
      }
      deleteTmpFile();
      return res.status(409).send(`object already exists, ${Key}`);
    });
  }
});

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'beta') {
  editorTools.get('/login', (req, res) => {
    res.status(200).send(editorHtmlString);
  });

  editorTools.get(/(?!\/restartserver|\/login|\/upload).*/, (req, res) => {
    res.redirect(307, `/login?url=${req.url}`);
  });
} else {
  editorTools.get(/(?!\/restartserver|\/upload).*/, (req, res) => {
    res.status(200).send(editorHtmlString);
  });
}


editorTools.listen(process.env.EDITOR_PORT ? process.env.EDITOR_PORT : 4000, err => {
  if (err) {
    console.error(err); // eslint-disable-line no-console
    return;
  }

<<<<<<< d3c8d13623aea3cbf13fcc99d1adbfcac89d2f09
  console.log( // eslint-disable-line no-console
    'Editor tools server started on port', process.env.EDITOR_PORT ? process.env.EDITOR_PORT : 4000
  );
});
=======
  console.log('Editor tools server started on port', process.env.EDITOR_PORT ? process.env.EDITOR_PORT : 4000); // eslint-disable-line no-console
  });
>>>>>>> Reset Server Button
