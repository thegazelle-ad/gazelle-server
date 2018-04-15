/**
 * This is needed as MySQL throws an error on too big inserts in one go
 * @param {*} knex - the knex instance
 * @param {*} tableName - name of the table to insert into
 * @param {*} rows - The rows to insert
 * @param {*} chunkSize - How many rows to insert at a time
 */
module.exports.batchInsert = async (knex, tableName, rows, chunkSize) => {
  // We need to split them up in chunks or mysql throws errors because of too big single request
  const n = rows.length;
  const promises = [];
  for (let startIndex = 0; startIndex < n; startIndex += chunkSize) {
    const subArray = rows.slice(startIndex, startIndex + chunkSize);
    promises.push(knex(tableName).insert(subArray));
    if (promises.length === 10) {
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(promises);
      promises.length = 0;
    }
  }
  await Promise.all(promises);
};
