const knex = require('knex')({
  client: 'mysql',
  connection: {
    "host": "127.0.0.1",
    "user": "root",
    "password": "circleci_test_gazelle",
    "database": "the_gazelle",
    "charset": "latin1"
  },
});

knex.select('*').from('categories').then(rows => {console.log(rows); knex.destroy()})
