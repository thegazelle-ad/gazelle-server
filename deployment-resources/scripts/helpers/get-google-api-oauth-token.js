// EVERYTHING BELOW HERE COMES FROM https://developers.google.com/drive/v3/web/quickstart/nodejs (with small modifications)

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/drive'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';

// Load client secrets from a local file.
fs.readFile(__dirname+'/client-secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.error('Error loading client secret file: ' + err);
    process.exit(1);
  }
  // Authorize a client with the loaded credentials, then call the
  // Drive API.
  getNewToken(JSON.parse(content));
});

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */

// Check if we already have a token
function getNewToken(credentials) {
  fs.stat(TOKEN_PATH, function(err, token) {
    if (err && err.code === "ENOENT") {
      // There isn't a token so we fetch one
      var clientSecret = credentials.installed.client_secret;
      var clientId = credentials.installed.client_id;
      var redirectUrl = credentials.installed.redirect_uris[0];
      var auth = new googleAuth();
      var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

      var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
      });
      console.log('Authorize this app by visiting this url: ', authUrl);
      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question('Enter the code from that page here: ', function(code) {
        rl.close();
        oauth2Client.getToken(code, function(err, token) {
          if (err) {
            console.log('Error while trying to retrieve access token', err);
            process.exit(1);
          }
          oauth2Client.credentials = token;
          storeToken(token);
        });
      });
    } else if (err) {
      console.error("Unknown error while looking for token: " + err);
      process.exit(1);
    } else {
      console.error("Error: you already fetched a token, delete it at ~/.credentials/drive-nodejs-quickstart.json before running this script again");
      process.exit(1);
    }
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      console.error(err);
      process.exit(1);
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}
