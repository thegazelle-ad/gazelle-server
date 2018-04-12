const moment = require('moment');
const { loremIpsum, placeImg } = require('./constants');
const { getCategoryId } = require('./utilities');

module.exports.addDummyArticles = (knex, numArticles, numCategories) => {
  const rows = [];
  const START_DATE = moment('2000-01-01');
  for (let i = 1; i <= numArticles; i++) {
    rows.push({
      id: i,
      slug: `slug-${i}`,
      title: `title-${i}`,
      markdown: loremIpsum,
      // TODO: When we have a markdown editor implemented run this through the
      // markdown parser function
      html: `<p>${loremIpsum}</p>`,
      image_url: placeImg,
      teaser: loremIpsum.substr(0, 156), // The max length of teaser
      views: i,
      created_at: START_DATE.add(i, 'days').toDate(),
      published_at: START_DATE.add(i + 1, 'days').toDate(),
      is_interactive: false,
      // We set the category later
      category_id: getCategoryId(i, numCategories),
    });
  }
  return knex('articles').insert(rows);
};
