import moment from 'moment';

import { withSearchableConcept } from 'components/admin/form-components/withSearchBar';
import { SearchBar } from 'components/admin/form-components/SearchBar';

export const SearchableAuthors = withSearchableConcept(
  ['name', 'slug'],
  item => item.name,
  'staff',
)(SearchBar);

export const SearchableArticles = withSearchableConcept(
  ['title', 'slug'],
  item => item.title,
  'articles',
)(SearchBar);

export const SearchableArticlesWithPubDate = withSearchableConcept(
  ['title', 'slug', 'published_at'],
  item => {
    const date =
      'published_at' in item
        ? `Published: ${moment(item.published_at).format('MMM DD, YYYY')}`
        : 'Unpublished';
    return `${item.title} - ${date}`;
  },
  'articles',
)(SearchBar);
