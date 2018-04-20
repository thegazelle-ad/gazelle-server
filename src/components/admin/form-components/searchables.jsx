import moment from 'moment';

import { withFalcorSearch } from 'components/admin/form-components/withFalcorSearch';
import { withSelector } from 'components/admin/form-components/withSelector';
import { SearchBar } from 'components/admin/form-components/SearchBar';

export const SearchableAuthors = withFalcorSearch(
  ['name', 'slug'],
  item => item.name,
  'staff',
)(SearchBar);

export const SearchableArticles = withFalcorSearch(
  ['title', 'slug'],
  item => item.title,
  'articles',
)(SearchBar);

export const SearchableArticlesWithPubDate = withFalcorSearch(
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

export const SearchableAuthorsSelector = withSelector(
  withFalcorSearch(['name', 'slug'], item => item.name, 'staff')(SearchBar),
);
