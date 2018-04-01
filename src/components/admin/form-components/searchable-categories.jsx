// import moment from 'moment';

import withSearchableConcept from 'components/admin/form-components/withSearchBar';
import SearchBar from 'components/admin/form-components/SearchBar';

// const searchableAuthors = {
//   formatter: item => item.name,
//   category: 'authors',
//   fields: ['name', 'slug'],
//   displayName: 'Authors',
// };

// const searchableArticles = {
//   formatter: item => item.title,
//   category: 'articles',
//   fields: ['title', 'slug'],
//   displayName: 'Articles',
// };

// const searchableArticlesWithPubDate = {
//   formatter: item => {
//     let date = item.published_at
//       ? `Published: ${moment(item.published_at).format('MMM DD, YYYY')}`
//       : (date = 'Unpublished');
//     return `${item.titel} - ${date}`;
//   },
//   category: 'articles',
//   fields: ['title', 'slug', 'published_at'],
//   displayName: 'ArticlesWithPubDate',
// };

export const SearchableAuthors = withSearchableConcept(
  ['name', 'slug', 'id'],
  item => item.name,
  'staff',
)(SearchBar);
// export const SearchableArticles = withSearchBar(searchableArticles);
// export const SearchableArticlesWithPubDate = withSearchBar(
//   searchableArticlesWithPubDate,
// );
