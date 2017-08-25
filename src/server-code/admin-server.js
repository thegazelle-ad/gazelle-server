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
import s3Config from '../../config/s3.config.js';

/* Helper libraries */
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
// Helps us parse post requests from falcor
import bodyParser from 'body-parser';

/* Our own helper functions */
import { isDevelopment, filterByEnvironment, hash } from 'lib/utilities';
import { md5Hash } from 'lib/server-utilities';


export default function runAdminServer(serverFalcorModel) {
  // Create MD5 hash of static files for better cache performance
  const clientScriptHash = md5Hash('./static/build/editor-client.js');
  const cssHash = md5Hash('./static/admin.css');

  const htmlString = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Gazelle Editor Tools</title>
        <link rel="stylesheet" href="/pure-min.css">
        <link rel="stylesheet" type="text/css" href="/admin.css?h=${cssHash}">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <div id="main">
          loading...
        </div>
        <script src="/build/editor-client.js?h=${clientScriptHash}"></script>
      </body>
    </html>
  `;

  // The server for the Admin website
  const app = express();

  // This is for parsing post requests
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

  // For connecting the client to our falcor server
  app.use('/model.json', FalcorServer.dataSourceRoute(() => (
    serverFalcorModel.asDataSource()
  )));

  // serving static files
  app.use(express.static('static'));

  const allowCrossDomain = (req, res, next) => {
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

  app.use(allowCrossDomain);

  /* Restart Servers command */
  const PATH_NAME = filterByEnvironment(
    `${__dirname}/scripts/restart-servers.sh`,
    '~/gazelle-beta/scripts/restart-servers.sh',
    '~/gazelle-production/scripts/restart-servers.sh'
  );

  let isRestarted = false;

  app.get('/restartserver', (req, res) => {
    if (isDevelopment) {
      res.status(200).send('start');
      return;
    }

    const password = req.query.password;
    if ((typeof password) !== 'string' || password.length < 1) {
      res.status(401).send('invalid');
    } else if (hash(password) === 'eaafc81d7868e1c203ecc90f387acfa4c24d1027134b0bfda6fd7c536efc5d8dd5718609a407dbfcd41e747aec331153d47733153afb7c125c558acba3fb6bcd') { // eslint-disable-line max-len
      isRestarted = true;
      res.status(200).send('start');
      exec(PATH_NAME, (err) => {
        if (err) {
          if (process.env.NODE_ENV !== 'production') {
            console.error(err); // eslint-disable-line no-console
          }
          res.status(500).send('error');
        }
      });
    } else {
      res.status(401).send('invalid');
    }
  });

  app.get('/isrestarted', (req, res) => {
    res.status(200).send(isRestarted);
  });

  /* Image Uploader */
  const uploadDir = path.join(__dirname, '../../tmp');

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

  app.post('/upload', upload.single('image'), (req, res) => {
    const filePath = req.file.path;
    const deleteTmpFile = () => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err); // eslint-disable-line no-console
        }
      });
    };
    if (isDevelopment) {
      /**
       * As we are in dev-mode, we don't actually want to upload to s3.
       * You can either compile with production mode or remove this
       * temporarily if extra s3 tests are needed at some point.
       */
      setTimeout(() => {
        res.status(200).send('success on test url');
      }, 2000);
      deleteTmpFile();
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

  if (!isDevelopment) {
    // If we are in staging or production we redirect to a forced login
    app.get('/login', (req, res) => {
      res.status(200).send(htmlString);
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
      res.status(200).send(htmlString);
    });
  }


  app.listen(process.env.EDITOR_PORT || 4000, err => {
    if (err) {
      console.error(err); // eslint-disable-line no-console
      return;
    }

    // eslint-disable-next-line no-console
    console.log(`Editor tools server started on port ${process.env.EDITOR_PORT || 4000}`);
  });
}
