import moment from 'moment';

import withSearchBar from 'components/admin/form-components/withSearchBar';

const searchableAuthors = {
  formatter: (item) => item.name,
  category: 'authors',
  fields: ['name', 'slug'],
  displayName: 'Authors',
};

const searchableArticles = {
  formatter: (item) => item.title,
  category: 'articles',
  fields: ['title', 'slug'],
  displayName: 'Articles',
};

const searchableArticlesWithPubDate = {
  formatter: (item) => {
    let date = (item.published_at)
      ? `Published: ${moment(item.published_at).format('MMM DD, YYYY')}`
      : date = 'Unpublished';
    return `${item.titel} - ${date}`;
  },
  category: 'articles',
  fields: ['title', 'slug', 'published_at'],
  displayName: 'ArticlesWithPubDate',
};

export const SearchableAuthors = withSearchBar(searchableAuthors);
export const SearchableArticles = withSearchBar(searchableArticles);
export const SearchableArticlesWithPubDate = withSearchBar(searchableArticlesWithPubDate);
