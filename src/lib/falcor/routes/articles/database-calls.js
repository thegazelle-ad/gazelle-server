import _ from 'lodash';

import { logger } from 'lib/logger';
import { has } from 'lib/utilities';

/**
 * @typedef PaginationArticle
 * @param {string} slug - The slug of the article
 */

/**
 * Fetches a page of articles where pages are a given length
 * @param {any} database - The knex instance to query on
 * @param {number} pageLength - Length of page to be fetched
 * @param {number} pageIndex - Which page to fetch of size pageLength
 * @returns {Promise<PaginationArticle[]>} - An array of articles on the page
 */
export async function getPaginatedArticle(database, pageLength, pageIndex) {
  const offset = pageLength * pageIndex;
  const articles = await database
    .select('slug')
    .from('articles')
    .orderBy('created_at', 'DESC')
    .limit(pageLength)
    .offset(offset);
  return articles;
}

/**
 *
 * @param {any} database  - The knex instance to query on
 * @param {Object} articleData - The data for the article to be created
 * @param {string} articleData.slug
 * @param {string} articleData.title
 * @param {string} [articleData.teaser]
 * @param {string} [articleData.imageUrl]
 * @param {number} [articleData.category] - The id of the category
 * @returns {Promise<boolean>} - Whether the creation was a success
 */
export async function createNewArticle(database, articleData) {
  // We first build the article object used for creation
  const insertObject = {};
  if (articleData.slug) {
    insertObject.slug = articleData.slug;
  }
  if (articleData.title) {
    insertObject.title = articleData.title;
  }
  if (articleData.teaser) {
    insertObject.category = articleData.teaser;
  }
  if (articleData.imageUrl) {
    insertObject.image_url = articleData.imageUrl;
  }
  if (articleData.category > 0) {
    insertObject.category = articleData.category;
  }
  // Remember to set created time
  insertObject.created_at = new Date();
  try {
    await database('articles').insert(insertObject);
  } catch (e) {
    logger.error(e);
    return false;
  }
  // if (_.get(articleData.authors, 'length', 0) > 0) {
  // }
  return true;
}

/**
 * Updates the tags for a given article.
 * @param   {database} database    The database
 * @param   {int}      articleId   The id of the article.
 * @param   {int[]}    newTags     The ids of the tags.
 * @returns {string[]} slugs       The edited slugs.
 */
export async function updateArticleTags(database, articleId, newTags) {
  // Delete old tags.
  await database('articles_tags')
    .where('article_id', '=', articleId)
    .del();

  // Insert new tags.
  const insertArray = _.map(newTags, tagId => ({
    article_id: articleId,
    tag_id: tagId,
  }));
  await database('articles_tags').insert(insertArray);

  // Get updated slugs.
  const rows = await database
    .select('slug')
    .from('articles_tags')
    .innerJoin('tags', 'tags.id', '=', 'articles_tags.tag_id')
    .where('article_id', '=', articleId);
  return rows.map(row => row.slug);
}

/**
 * @param   {database} database    The database
 * @param   {string[]} ids       The ids whose tags we receive
 * @returns {Object}   data        The data
 */
export async function articleTagQuery(database, ids) {
  // ids function parameter is an array of article ids
  // of which to fetch the tag of.
  // The function returns an object with article ids
  // as keys and values being arrays of author ids.
  const rows = await database
    .select('articles.slug as articleSlug', 'tags.slug as tagSlug')
    .from('tags')
    .innerJoin('articles_tags', 'tags.id', '=', 'tag_id')
    .innerJoin('articles', 'articles.id', '=', 'article_id')
    .whereIn('articles.id', ids)
    .orderBy('articles_tags.id', 'asc');

  const data = {};
  rows.forEach(row => {
    // This will input them in ascending order by id (which represents time they were
    // inserted as author of that article) as the query was structured so.
    if (!has.call(data, row.articleSlug)) {
      data[row.articleSlug] = [row.tagSlug];
    } else {
      data[row.articleSlug].push(row.tagSlug);
    }
  });
  return data;
}
