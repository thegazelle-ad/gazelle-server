/* eslint-disable no-console */
/*
 * These first two functions are the meat of the code, the rest
 * is mostly boilerplate from Google to ensure authentication etc.
 */

const dateToyyyymmdd = date => {
  const yyyy = date.getFullYear();
  const mm = date.getMonth() + 1; // getMonth() is zero-based
  const dd = date.getDate();
  let dateString = `${yyyy}-`;
  if (mm < 10) {
    dateString += '0';
  }
  dateString += `${mm}-`;
  if (dd < 10) {
    dateString += '0';
  }
  dateString += dd.toString();
  return dateString;
};

// Own code
function uploadDatabaseDump(auth) {
  const drive = google.drive({ version: 'v3', auth });
  // get file path from arguments
  const [, , inputFilePath] = process.argv;
  if (!inputFilePath) {
    console.error('Error: No filename was specified in arguments');
    process.exit(1);
  }

  drive.files.list(
    {
      q:
        "name='Database Dumps' and mimeType='application/vnd.google-apps.folder'",
    },
    (err, listFileResponse) => {
      if (err) {
        throw err;
      }
      if (listFileResponse.data.files.length !== 1) {
        console.error(
          "found more than one folder named 'Timestamped Ghost Dumps'",
        );
        process.exit(1);
      }
      const folderId = listFileResponse.data.files[0].id;
      const dateString = dateToyyyymmdd(new Date());
      const uploadedFileName = `${dateString}.dump`;
      drive.files.create(
        {
          requestBody: {
            name: uploadedFileName,
            mimeType: 'application/octet-stream',
            parents: [folderId],
          },
          media: {
            mimeType: 'application/octet-stream',
            body: fs.createReadStream(inputFilePath),
          },
        },
        (createError, createFileResponse) => {
          if (createError) {
            console.error(createError);
            process.exit(1);
          }
          console.log('Sucessfully uploaded database dump');
          console.log(
            `Response: ${JSON.stringify(createFileResponse.data, null, 4)}`,
          );
        },
      );
    },
  );
}

/*
 * This is the boilerplate, that has been edited somewhat but is mostly the same as
 * when taken from the sample at https://developers.google.com/drive/api/v3/quickstart/nodejs.
 * We pass in uploadDatabaseDump as our callback
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete credentials.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = path.join(__dirname, 'credentials.json');
const CLIENT_SECRET_PATH = path.join(__dirname, 'client-secret.json');

// Load client secrets from a local file
fs.readFile(CLIENT_SECRET_PATH, (err, content) => {
  if (err) {
    console.log('Error loading client secret file:', err);
    process.exit(1);
  }
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(JSON.parse(content), uploadDatabaseDump);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {
    client_secret: clientSecret,
    client_id: clientId,
    redirect_uris: redirectUris,
  } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUris[0],
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      getAccessToken(oAuth2Client, callback);
      return;
    }
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), writeErr => {
        if (writeErr) {
          console.error(writeErr);
          process.exit(1);
        }
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}
