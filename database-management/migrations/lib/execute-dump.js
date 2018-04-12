const fs = require('fs');
const path = require('path');

module.exports.executeDump = async (knex, fileName) => {
  const initializerDump = fs.readFileSync(
    path.join(__dirname, '..', fileName),
    'utf8',
  );
  // Note that we can't just execute it all in one knex.raw statement since
  // knex.raw only allows a single statement at a time, probably to safeguard
  // against SQL injection. We use the for loop to ensure ordered execution of
  // the dumpfile, where .forEach has each callback being a separate function
  // so it can't be forced to be ordered. We don't mind the restricted syntax
  // in this case as we already use regenerator runtime for async / await and
  // a for loop is needed here
  const commands = initializerDump
    .split(';')
    .map(x => x.trim())
    .filter(x => x);
  // eslint-disable-next-line no-restricted-syntax
  for (const singleCommand of commands) {
    // eslint-disable-next-line no-await-in-loop
    await knex.raw(`${singleCommand};`);
  }
};
