// Emil hacking because he can't find a babel plugin that does it for some reason
if (!Array.prototype.flatten) {
  // eslint-disable-next-line
  Array.prototype.flatten = function flatten() {
    return this.reduce((acc, cur) => acc.concat(cur), []);
  };
}

/* Falcor */
import falcor from 'falcor';
// The custom falcor code we write
import FalcorRouter from 'lib/falcor/FalcorRouter';

/* Helper libraries */
import sourcemap from 'source-map-support';

/* Our helper functions */
import { filterByEnvironment, isProduction } from 'lib/utilities';

/* The actual server code for the two websites */
import runMainServer from 'server-code/main-server';
import runAdminServer from 'server-code/admin-server';

/* Server code starts */
// Announce the build version for clarity
const args = ['DEVELOPMENT BUILD', 'STAGING BUILD', 'PRODUCTION BUILD'];
console.log(filterByEnvironment(...args)); // eslint-disable-line no-console

// Allow node to use sourcemaps
if (isProduction) {
  sourcemap.install();
}

// Shared serverModel
const serverModel = new falcor.Model({
  source: new FalcorRouter({ maxPaths: 1000 * 1000 }),
  // maxSize is 400 MB in production and 80 MB when in development or staging mode
  maxSize: filterByEnvironment(400 * 1000 * 1000, 80 * 1000 * 1000),
  collectRatio: 0.75,
}).batch();

/**
 * Reset cache trending data every minute so we're sure that we always
 * have up to date trending data available.
 */
function resetTrending() {
  serverModel.invalidate(['trending']);
}
setInterval(resetTrending, 60 * 1000);

// Run the two servers
runMainServer(serverModel);
runAdminServer(serverModel);
