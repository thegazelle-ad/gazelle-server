/*
 * This is just an acknowledgement that this is super hacky. But it is verified empirically
 * that this will fix the mess our encoding has become on the production database by running
 * it on a dump locally.
 *
 * It should basically not do anything when running it as an initial migration other than change
 * the default encodings of your database which is also good anyway as then we don't have to worry
 * about it for future migrations
 *
 * The fix is taken from #4 at https://coderwall.com/p/gjyuwg/mysql-convert-encoding-to-utf8-without-garbled-data
 * And we're using utf8mb4_unicode_ci based on https://stackoverflow.com/a/766996/5711883
 */

const getConvertToUtf8mb4Query = tableName =>
  `ALTER TABLE \`${tableName}\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`;
const convertTableQueryToDatabaseQuery = query =>
  query.replace('CONVERT TO ', '').replace('TABLE', 'DATABASE');
const getConvertDatabaseToUtf8mb4Query = databaseName =>
  convertTableQueryToDatabaseQuery(getConvertToUtf8mb4Query(databaseName));

const getKnexConnection = require('knex');

exports.up = async theGazelle => {
  const { config } = theGazelle.client;
  const informationSchema = getKnexConnection({
    ...config,
    connection: {
      ...config.connection,
      database: 'information_schema',
    },
  });
  const databaseName = config.connection.database;

  // When we fix the encoding this causes a slug collision as there are 2 Adam Nagys
  // in the database (maybe with different encodings of the slug? It's a mess anyway).
  // The one we're deleting is the one without anything associated with it. Without this
  // the whole migration fails because of the collision
  await theGazelle('staff')
    .where('slug', '=', 'Ã¡dÃ¡m-nagy')
    .del();

  // Here we get the relevant columns and tables
  let columnsToConvert;
  let tablesToConvert;
  try {
    columnsToConvert = await informationSchema
      .select('table_name', 'column_name')
      .from('columns')
      .where('table_schema', '=', databaseName)
      .whereNotNull('character_set_name')
      .where('table_name', 'not like', 'knex%');
    tablesToConvert = (await informationSchema
      .distinct('table_name')
      .from('tables')
      .where('table_schema', '=', databaseName)
      .where('table_name', 'not like', 'knex%')).map(x => x.table_name);
  } catch (e) {
    // Cleaning up for good practice
    await informationSchema.destroy();
    throw e;
  }
  await informationSchema.destroy();

  // We then fix our messed up encodings so that all the data is actually UTF8
  await Promise.all(
    columnsToConvert.map(row => {
      const { table_name: table, column_name: col } = row;
      return theGazelle.raw(
        `UPDATE \`${table}\` SET \`${col}\` = @txt WHERE char_length(\`${col}\`) =  LENGTH(@txt := CONVERT(BINARY CONVERT(\`${col}\` USING latin1) USING utf8))`,
      );
    }),
  );

  // We then convert it to the more correct uf8mb4 as MySQL sucks and doesn't just make things work for us :(
  await Promise.all(
    tablesToConvert.map(tableName =>
      theGazelle.raw(getConvertToUtf8mb4Query(tableName)),
    ),
  );

  // We finally also change the database default to utf8mb4 so we don't have to worry about this in the future
  await theGazelle.raw(getConvertDatabaseToUtf8mb4Query(databaseName));
};

/**
 * We are not going to write a down migration as the data was a mess before,
 * so it's not really recoverable and that's okay. Also we didn't change anything
 * in the structure of the database so it wouldn't break the chain of down migrations
 * that this one doesn't do anything.
 */
exports.down = async () => {};
