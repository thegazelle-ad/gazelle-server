'use strict';

const fs = require('fs');

let databaseConfig;
try {
  databaseConfig = fs.readFileSync(__dirname+'/../../config/database.config.js', 'utf8');
    // removes the export default and last 2 characters '`;'
    databaseConfig = databaseConfig.substring(15, databaseConfig.length-2);
} catch(err) {
  if (err.code === "ENOENT") {
    console.error("ERROR: You have to copy and fill out the database.config.example.js file to database.config.js first. Currently no file database.config.js exists");
    process.exit();
  }
  else {
    throw err;
  }
}

// Remove the comments for JSON parsing
let stringArray = databaseConfig.split('\n');
stringArray = stringArray.map((string) => {
  return string.trim();
});
stringArray = stringArray.filter((string) => {
  return string.substr(0, 2) !== "//";
});
// Parse the JSON
databaseConfig = JSON.parse(stringArray.join(''));

const database = require('knex')({
  client: 'mysql',
  connection: databaseConfig,
});

fs.stat(__dirname+'/../../config/ghost.config.js', (err, stats) => {
  if (!err) {
    // File exists
    let ghostConfig = fs.readFileSync(__dirname+'/../../config/ghost.config.js', 'utf8');
    // removes the export default and last 2 characters '`;'
    ghostConfig = ghostConfig.substring(15, ghostConfig.length-2);
    // Remove comments for easy parsing
    let stringArray = ghostConfig.split('\n');
    stringArray = stringArray.map((string) => {
      return string.trim();
    });
    stringArray = stringArray.filter((string) => {
      return string.substr(0, 2) !== "//";
    });
    // Parse JSON
    ghostConfig = JSON.parse(stringArray.join(''));
    if (!process.env.CIRCLECI) {
      // This is a real person setting up their environment
      database.select('slug', 'secret').from('clients').where('slug', '=', 'ghost-admin')
      .then((rows) => {
        if (rows.length !== 1) {
          database.destroy();
          throw new Error("database query returned more than 1 ghost-admin");
        }
        ghostConfig.client_id = rows[0].slug;
        ghostConfig.client_secret = rows[0].secret;
        fs.writeFileSync(__dirname+"/../../config/ghost.config.js", "export default " + JSON.stringify(ghostConfig, null, 2) + ';\n');
        database.destroy();
      });
    } else {
      // This is CircleCI testing our build so we create a dummy
      ghostConfig.client_id = "dummy";
      ghostConfig.client_secret = "dummy";
      fs.writeFileSync(__dirname+"/../../config/ghost.config.js", "export default " + JSON.stringify(ghostConfig, null, 2) + ';\n');
    }
  } else if (err.code === 'ENOENT') {
    database.destroy();
    throw new Error("You have to first copy ghost.config.example.js into ghost.config.js. No ghost.config.js file exists at this time");
  } else {
    database.destroy();
    throw new Error("Unexpected error code: " + err.code);
  }
});
