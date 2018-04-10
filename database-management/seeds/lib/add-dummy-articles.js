const moment = require('moment');

module.exports.addDummyArticles = async (knex, numArticles) => {
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
      image_url: 'https://placeimg.com/640/480/any',
      teaser: loremIpsum.substr(0, 156), // The max length of teaser
      views: i,
      created_at: START_DATE.add(i, 'days').toDate(),
      published_at: START_DATE.add(i + 1, 'days').toDate(),
      is_interactive: false,
      // We set the category later
      category_id: null,
    });
  }
  await knex('articles').insert(rows);
};

const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam scelerisque dolor laoreet sodales posuere. Maecenas et dolor leo. In accumsan purus feugiat, sollicitudin nisi et, fringilla turpis. Aenean ultricies diam in ante interdum, vitae laoreet enim tincidunt. Aliquam non pretium mi, non euismod augue. Quisque rhoncus posuere volutpat. Fusce rhoncus dictum quam vel varius. Nulla non bibendum enim. Pellentesque iaculis mi ut rhoncus fringilla. Ut placerat posuere ultrices.

Sed ut laoreet diam. Curabitur quis purus ante. Aliquam non faucibus nisl. Ut vulputate magna metus, a sollicitudin ligula ultricies a. Duis blandit nulla nulla, in efficitur ligula tempor ut. Nam nisi sapien, egestas vel ornare sed, placerat sed turpis. Suspendisse fringilla commodo dapibus. Donec in ipsum gravida, aliquet odio maximus, interdum nibh.

Vivamus porttitor scelerisque scelerisque. Aenean vestibulum mattis venenatis. In gravida viverra diam vitae blandit. Cras in lacinia felis. Sed varius enim vel velit cursus, a iaculis lectus placerat. Integer in elementum elit, ut lobortis mi. Maecenas eu volutpat quam, a vestibulum orci. Duis consectetur est tellus, ac viverra libero pretium ut. Curabitur a nunc tempus, rutrum massa sed, imperdiet sem. Suspendisse sollicitudin neque non blandit dapibus. Nam nec enim sed eros venenatis consectetur convallis eget nunc. In pharetra imperdiet lacus, nec pretium dolor placerat quis. Suspendisse dui sem, vehicula eget euismod aliquam, suscipit lobortis tortor. Mauris consectetur tristique lacus sit amet pulvinar.

Nam at pellentesque ligula. Maecenas accumsan cursus libero sit amet rutrum. In tristique ligula sit amet risus egestas placerat. Pellentesque mollis tincidunt enim, et egestas orci auctor et. Morbi rhoncus varius molestie. Cras sem mi, scelerisque sed porta in, hendrerit a mauris. Cras pretium nibh tempus nunc varius, nec consectetur sem mattis. Sed at ante at enim pulvinar iaculis quis ac enim. Curabitur vehicula mauris at erat efficitur ornare. Phasellus blandit quam ut ante congue imperdiet. Sed.`;
