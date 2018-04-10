const { loremIpsum } = require('./constants');

module.exports.addDummyInfoPages = async knex => {
  const loremIpsumHtml = `<p>${loremIpsum}</p>`;
  const rows = [
    {
      id: 1,
      slug: 'about',
      title: 'About',
      html: loremIpsumHtml,
    },
    {
      id: 2,
      slug: 'ethics',
      title: 'Code Of Ethics',
      html: loremIpsumHtml,
    },
  ];
  await knex('info_pages').insert(rows);
};
