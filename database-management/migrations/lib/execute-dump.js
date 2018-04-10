const fs = require('fs');
const path = require('path');

module.exports.executeDump = async (knex, fileName) => {
  const initializerDump = fs.readFileSync(
    path.join(__dirname, '..', fileName),
    'utf8',
  );
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
