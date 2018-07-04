// Inspired by http://stackoverflow.com/questions/3066586/get-string-in-yyyymmdd-format-from-js-date-object
// but code modified extensively
Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear();
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();
  var dateString = yyyy.toString()+'-';
  if (mm < 10) {
    dateString += '0';
  }
  dateString += mm.toString()+'-';
  if (dd < 10) {
    dateString += '0';
  }
  dateString += dd.toString();
  return dateString;
};

// Own code
function uploadDatabaseDump(auth) {
  var service = google.drive({version: 'v3', auth: auth});
  // get file path from arguments
  var inputFilePath = process.argv[2];
  if (!inputFilePath) {
    console.error("Error: No filename was specified in arguments");
    process.exit(1);
  }
  var buffer = fs.readFileSync(inputFilePath);

  service.files.list({
    q: "name='Timestamped Ghost Dumps' and mimeType='application/vnd.google-apps.folder'"
  }, (err, response) => {
    if (err) {
      throw err;
    }
    if (response.files.length !== 1) {
      console.error("found more than one folder named 'Timestamped Ghost Dumps'");
      process.exit(1);
    }
    var folderId = response.files[0].id;
    var dateString = new Date().yyyymmdd();
    var outputFileName = dateString + '.dump';
    service.files.create({
      resource: {
        name: outputFileName,
        mimeType: 'application/octet-stream',
        parents: [folderId],
      },
      media: {
        mimeType: 'application/octet-stream',
        body: buffer,
      },
      uploadType: "resumable"
    }, (err, response) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    })
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
  authorize(JSON.parse(content), uploadDatabaseDump);
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
  // Get the stored token
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      console.error("Error: You have to run getGoogleApiOAuthToken.sh first, no token currently stored");
      process.exit(1);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}
