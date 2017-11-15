// Own code
function getTestDatabase(auth) {
  var service = google.drive({version: 'v3', auth: auth});

  service.files.list({
    q: "name = 'CircleCI_test1.dump' and mimeType = 'application/octet-stream'"
  }, (err, response) => {
    if (err) {
      throw err;
    }
    if (response.files.length !== 1) {
      throw new Error ("found more than one file named 'CircleCI_test1.dump'");
    }
    const id = response.files[0].id;
    const dest = fs.createWriteStream(__dirname + '/test.dump');
    service.files.get({
      fileId: id,
      alt: 'media',
    })
    .on('error', err => console.log('Error during download of test database', err))
    .pipe(dest);
  })
}

// EVERYTHING BELOW HERE COMES FROM https://developers.google.com/drive/v3/web/quickstart/nodejs (with small modifications)

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/drive'];
var TOKEN = process.env.CIRCLECI_GOOGLE_API;
if (!TOKEN) {
  throw new Error('This script should only be run by CircleCI with the CIRCLECI_GOOGLE_API variable set to the API key');
}

// Load client secrets from a local file.
fs.readFile('./scripts/helpers/client-secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Drive API.
  authorize(JSON.parse(content), getTestDatabase);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  oauth2Client.credentials = JSON.parse(TOKEN);
  callback(oauth2Client);
}
