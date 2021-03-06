/* Falcor */
import FalcorServer from 'falcor-express';

/* Express Server Software */
import express from 'express';

/* AWS S3 */
import AWS from 'aws-sdk';
import s3 from 's3';
// Needed for receiving the multi-part file upload
import multer from 'multer';

// Our own custom config
import { getConfig } from '../config';

/* Helper libraries */
import fs from 'fs';
import { exec } from 'child_process';
import path from 'path';
// Helps us parse post requests from falcor
import bodyParser from 'body-parser';

import request from 'request';

/* Our own helper functions */
import {
  isDevelopment,
  hash,
  isCI,
  googleClientID,
  googleWhitelist,
  nothingAllowedRobotsTxt,
} from 'lib/utilities';

import { logger } from 'lib/logger';

import { md5Hash, compressJPEG, deleteFile } from 'lib/server-utilities';

export default function runAdminServer(serverFalcorModel) {
  // Create MD5 hash of static files for better cache performance
  let clientScriptHash = md5Hash(
    path.join(__dirname, '../../static/build/admin-client.js'),
  );
  let adminCssHash = md5Hash(path.join(__dirname, '../../static/admin.css'));
  let mainCssHash = md5Hash(
    path.join(__dirname, '../../static/build/main.css'),
  );

  const buildHtmlString = () => {
    if (isDevelopment()) {
      // As described in the main server file we only recompute hashes in development
      clientScriptHash = md5Hash(
        path.join(__dirname, '../../static/build/admin-client.js'),
      );
      adminCssHash = md5Hash(path.join(__dirname, '../../static/admin.css'));
      mainCssHash = md5Hash(
        path.join(__dirname, '../../static/build/main.css'),
      );
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>The Gazelle's Admin Interface</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css">
          <link rel="stylesheet" type="text/css" href="/admin.css?h=${adminCssHash}">
          <link rel="stylesheet" type="text/css" href="/build/main.css?h=${mainCssHash}">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta name="google-signin-client_id" content="${googleClientID}">
          <script>
            // In order to avoid 'undefined has no property X' errors
            window.THE_GAZELLE = {};
          </script>
          <script src="https://apis.google.com/js/platform.js" onload='window.THE_GAZELLE.googleAPILoaded=true' async defer></script>
        </head>
        <body>
          <div id="main">
            loading...
          </div>
          <script src="/build/admin-client.js?h=${clientScriptHash}"></script>
        </body>
      </html>
    `;
  };

  // The server for the Admin website
  const app = express();

  // This is for parsing post requests
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
  app.use(bodyParser.json());

  // For connecting the client to our falcor server
  app.use(
    '/model.json',
    FalcorServer.dataSourceRoute(() => serverFalcorModel.asDataSource()),
  );

  // serving static files
  app.use(express.static('static'));

  const allowCrossDomain = (req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Methods',
        'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      );
      res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Content-Length, X-Requested-With',
      );
      res.send(200);
    } else {
      next();
    }
  };

  app.use(allowCrossDomain);

  const RESTART_SERVERS_PATH_NAME = JSON.stringify(
    `${
      getConfig().ROOT_DIRECTORY
    }/deployment-resources/scripts/restart-servers.sh`,
  );

  let isRestarted = false;

  app.post('/restart-server', (req, res) => {
    const { password } = req.body;
    if (typeof password !== 'string' || password.length < 1) {
      res.sendStatus(401);
    } else if (
      hash(password) ===
      'eaafc81d7868e1c203ecc90f387acfa4c24d1027134b0bfda6fd7c536efc5d8dd5718609a407dbfcd41e747aec331153d47733153afb7c125c558acba3fb6bcd'
    ) {
      // eslint-disable-line max-len
      isRestarted = true;
      res.sendStatus(200);
      exec(RESTART_SERVERS_PATH_NAME, err => {
        if (err) {
          if (getConfig().NODE_ENV !== 'production') {
            logger.error(err);
          }
          // In the case of an error isRestarted will stay true and so the ping will fail correctly
        }
      });
    } else {
      res.sendStatus(401);
    }
  });

  app.get('/is-restarted', (req, res) => {
    res.status(200).send(isRestarted);
  });

  /* Image Uploader */
  const uploadDir = `${getConfig().ROOT_DIRECTORY}/tmp`;

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

  const s3Config = {
    accessKeyId: getConfig().AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: getConfig().AWS_S3_SECRET_ACCESS_KEY,
    apiVersion: '2006-03-01',
  };

  const awsSdkClient = new AWS.S3(s3Config);

  const s3Client = s3.createClient({
    s3Client: awsSdkClient,
  });

  app.post('/upload', upload.single('image'), (req, res) => {
    const filePath = req.file.path;

    if (isDevelopment()) {
      /**
       * As we are in dev-mode, we don't actually want to upload to s3.
       * You can either compile with production mode or remove this
       * temporarily if extra s3 tests are needed at some point.
       */
      compressJPEG(filePath).then(() => {
        setTimeout(() => {
          res.status(200).send('success test_url');
        }, 2000);

        deleteFile(filePath).catch(error => logger.debug(error));
      });
    } else {
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

      /* Compress image, then upload to S3 */
      compressJPEG(filePath).then(() => {
        awsSdkClient.headObject({ Bucket, Key }, err => {
          if (err && err.code === 'NotFound') {
            const s3Uploader = s3Client.uploadFile(s3Params);
            s3Uploader.on('error', s3Err => {
              logger.error(s3Err);

              deleteFile(filePath).catch(error => logger.debug(error));
              return res.status(500).send('Error uploading');
            });
            s3Uploader.on('end', () => {
              const imageUrl = s3.getPublicUrl(Bucket, Key);

              deleteFile(filePath).catch(error => logger.debug(error));
              return res.status(200).send(`success ${imageUrl}`);
            });
          }

          deleteFile(filePath).catch(error => logger.debug(error));
          return res.status(409).send(`object already exists, ${Key}`);
        });
      });
    }
  });

  app.get('/robots.txt', (req, res) => {
    res
      .status(200)
      .type('txt')
      .send(nothingAllowedRobotsTxt);
  });

  if (!isDevelopment()) {
    // If we are in staging or production we redirect to a forced login
    app.get('/login', (req, res) => {
      res.status(200).send(buildHtmlString());
    });
    app.get(/(?!\/restartserver|\/login|\/upload).*/, (req, res) => {
      res.redirect(307, `/login?url=${req.url}`);
    });
  } else {
    /**
     * In development we don't care about login, if you need to test login you can either
     * simply visit the /login URL or if you need to test the redirect just change the if
     * statements here
     */
    app.get(/(?!\/restartserver|\/upload).*/, (req, res) => {
      res.status(200).send(buildHtmlString());
    });
  }

  app.post('/googlelogin', (req, res) => {
    const token = req.body.data;
    const endpoint = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${encodeURIComponent(
      token,
    )}`;

    request.get(endpoint, (error, response, body) => {
      if (error) {
        res.status(500).send('google auth internal server error');
      }

      const content = JSON.parse(body);
      // aud should contain our google client id
      const { aud } = content;
      const { email } = content;

      if (aud.trim() === googleClientID) {
        // in dev mode, allow any valid email address
        // in production, require email to be in whitelist (defined in utilities.js)
        if (isDevelopment()) {
          res.sendStatus(200);
        } else if (googleWhitelist.indexOf(email) !== -1) {
          res.sendStatus(200);
        } else {
          res.status(401).send('unauthorized user');
        }
      } else {
        res.status(401).send('invalid token');
      }
    });
  });

  const port = isCI() ? 4000 : getConfig().ADMIN_PORT;
  app.listen(port, err => {
    if (err) {
      logger.error(err);

      return;
    }

    logger.debug(`Admin tools server started on port ${port}`);
  });
}
