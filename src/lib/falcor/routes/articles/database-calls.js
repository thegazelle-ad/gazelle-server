// import _ from 'lodash';
import { logger } from 'lib/logger';

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
