import _ from 'lodash';

import { database } from 'lib/db';
import { has } from 'lib/utilities';

/**
 * @typedef PaginationArticle
 * @param {string} slug - The slug of the article
 */

/**
 * Fetches a page of articles where pages are a given length
 * @param {number} pageLength - Length of page to be fetched
 * @param {number} pageIndex - Which page to fetch of size pageLength
 * @returns {Promise<PaginationArticle[]>} - An array of articles on the page
 */
export async function getPaginatedArticle(pageLength, pageIndex) {
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
 * Updates the tags for a given article.
 * @param   {int}      articleId   The id of the article.
 * @param   {int[]}    newTags     The ids of the tags.
 * @returns {string[]} slugs       The edited slugs.
 */
export async function updateArticleTags(articleId, newTags) {
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
 * @param   {string[]} slugs the slugs whose tags we receive
 * @returns {Object}   data  the data
 */
export async function articleTagQuery(slugs) {
  // slugs function parameter is an array of article slugs
  // of which to fetch the tag of.
  // The function returns an object with article slugs
  // as keys and values being arrays of author slugs.
  const rows = await database
    .select('articles.slug as articleSlug', 'tags.slug as tagSlug')
    .from('tags')
    .innerJoin('articles_tags', 'tags.id', '=', 'tag_id')
    .innerJoin('articles', 'articles.id', '=', 'article_id')
    .whereIn('articles.slug', slugs)
    .orderBy('articles_tags.id', 'asc')
    .catch(e => {
      // database.destroy();
      throw new Error(e);
    });

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
