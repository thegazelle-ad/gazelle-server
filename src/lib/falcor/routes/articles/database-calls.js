import _ from 'lodash';

import { logger } from 'lib/logger';
import { has } from 'lib/utilities';
import { buildErrorMessage } from 'lib/error-helpers';

/**
 * @typedef PaginationArticle
 * @property {string} slug - The slug of the article
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
 * @param {any} database  - The knex instance to query on
 * @param {Object} articleData - The data for the article to be created
 * @param {string} articleData.slug
 * @param {string} articleData.title
 * @param {string} [articleData.teaser]
 * @param {string} [articleData.imageUrl]
 * @param {number} [articleData.category] - The id of the category
 * @param {Object[]} [articleData.authors]
 * @param {number} [articleData.authors.id]
 * @param {Object[]} [articleData.tags]
 * @param {number} [articleData.tags.id]
 * @returns {Promise<boolean>} - Whether the creation was a success
 */
export async function createNewArticle(database, articleData) {
  // We first build the article object used for creation
  if (!articleData.slug || !articleData.title) {
    logger.warn('Someone tried creating an article without slug or title');
    throw new Error('Both slug and title must be provided for new articles');
  }
  const articleRow = {
    slug: articleData.slug,
    title: articleData.title,
  };
  if (articleData.teaser) {
    articleRow.teaser = articleData.teaser;
  }
  if (articleData.imageUrl) {
    articleRow.image_url = articleData.imageUrl;
  }
  if (articleData.category > 0) {
    articleRow.category_id = articleData.category;
  }
  // Remember to set created time
  articleRow.created_at = new Date();
  let createdArticle;
  try {
    const [id] = await database('articles').insert(articleRow);
    createdArticle = {
      ...articleRow,
      id,
    };
  } catch (e) {
    logger.error(e);
    throw new Error(buildErrorMessage());
  }
  const inserts = [];
  if (_.get(articleData.authors, 'length', 0) > 0) {
    const authorArticleRows = articleData.authors.map(authorObject => {
      if (!authorObject.id) {
        logger.error(
          new Error('All authors in new article must have an id passed'),
        );
        throw new Error(buildErrorMessage());
      }
      return {
        author_id: authorObject.id,
        article_id: createdArticle.id,
      };
    });
    inserts.push(database('authors_articles').insert(authorArticleRows));
    createdArticle.authors = authorArticleRows;
  }
  if (_.get(articleData.tags, 'length', 0) > 0) {
    const articleTagRows = articleData.tags.map(tagObject => {
      if (!tagObject.id) {
        logger.error(
          new Error('All tags in new article must have an id passed'),
        );
        throw new Error(buildErrorMessage());
      }
      return {
        tag_id: tagObject.id,
        article_id: createdArticle.id,
      };
    });
    inserts.push(database('articles_tags').insert(articleTagRows));
    createdArticle.tags = articleTagRows;
  }
  try {
    await Promise.all(inserts);
  } catch (e) {
    logger.error(e);
    throw new Error(buildErrorMessage());
  }
  return createdArticle;
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
    .select('articles.id as articleId', 'tags.slug as tagSlug')
    .from('tags')
    .innerJoin('articles_tags', 'tags.id', '=', 'tag_id')
    .innerJoin('articles', 'articles.id', '=', 'article_id')
    .whereIn('articles.id', ids)
    .orderBy('articles_tags.id', 'asc');

  const data = {};
  rows.forEach(row => {
    // This will input them in ascending order by id (which represents time they were
    // inserted as author of that article) as the query was structured so.
    if (!has.call(data, row.articleId)) {
      data[row.articleId] = [row.tagSlug];
    } else {
      data[row.articleId].push(row.tagSlug);
    }
  });
  return data;
}

// TODO: refactor this to use async await and all the other nice stuff, disabling linting until then
/* eslint-disable */
function orderArticlesInIssues(database, issues) {
  // Issues is assumed to be an array of integers where
  // the integers are the ids of issues
  return new Promise(resolve => {
    let updatesCalled = 0;
    let updatesReturned = 0;
    issues.forEach(issue_id => {
      // Get the current categories so we know if we have to add new ones
      // or delete old ones
      database
        .select('category_id', 'categories_order')
        .from('issues_categories_order')
        .where('issue_id', '=', issue_id)
        .orderBy('categories_order', 'ASC')
        .then(categoryRows => {
          database
            .select(
              'issues_articles_order.id as id',
              'category_id',
              'article_order',
            )
            .from('issues_articles_order')
            .innerJoin(
              'articles',
              'articles.id',
              '=',
              'issues_articles_order.article_id',
            )
            .where('type', '=', 0)
            .where('issue_id', '=', issue_id)
            .orderBy('category_id', 'ASC')
            .orderBy('issues_articles_order.article_order', 'ASC')
            .then(articleRows => {
              let lastCategory = null;
              let order = 0;
              const toUpdate = [];
              const newCategories = [];
              articleRows.forEach(row => {
                if (lastCategory !== row.category_id) {
                  lastCategory = row.category_id;
                  order = 0;
                  newCategories.push(row.category_id);
                }
                if (order !== row.article_order) {
                  toUpdate.push({
                    id: row.id,
                    update: {
                      article_order: order,
                    },
                  });
                }
                order += 1;
              });
              updatesCalled += toUpdate.length;
              toUpdate.forEach(obj => {
                database('issues_articles_order')
                  .where('id', '=', obj.id)
                  .update(obj.update)
                  .then(() => {
                    updatesReturned += 1;
                    if (updatesReturned >= updatesCalled) {
                      resolve(true);
                    }
                  });
              });
              // Check if categories are still consistent
              let newCategoriesWithOrder = [];
              let consistent = true;
              categoryRows.forEach(category => {
                if (
                  newCategories.find(cat => cat === category.category_id) !==
                  undefined
                ) {
                  newCategoriesWithOrder.push(category);
                } else {
                  consistent = false;
                }
              });
              newCategories.forEach(category_id => {
                if (
                  newCategoriesWithOrder.find(
                    cat => cat.category_id === category_id,
                  ) === undefined
                ) {
                  consistent = false;
                  const foundHole = newCategoriesWithOrder.some(
                    (cat, index) => {
                      if (index !== cat.categories_order) {
                        newCategoriesWithOrder.splice(index, 0, {
                          category_id,
                          categories_order: index,
                        });
                        return true;
                      }
                      return false;
                    },
                  );
                  if (!foundHole) {
                    newCategoriesWithOrder.push({
                      category_id,
                      categories_order: newCategoriesWithOrder.length,
                    });
                  }
                }
              });
              if (!consistent) {
                newCategoriesWithOrder = newCategoriesWithOrder.map(
                  (cat, index) => ({
                    ...cat,
                    categories_order: index,
                    issue_id,
                  }),
                );
                updatesCalled += 1;
                // Delete the current categories order and insert the new one
                database('issues_categories_order')
                  .where('issue_id', '=', issue_id)
                  .del()
                  .then(() => {
                    database('issues_categories_order')
                      .insert(newCategoriesWithOrder)
                      .then(() => {
                        updatesReturned += 1;
                        if (updatesReturned >= updatesCalled) {
                          resolve(true);
                        }
                      });
                  });
              } else if (updatesCalled === 0) {
                resolve(true);
              }
            });
        });
    });
  });
}
/* eslint-enable */

/**
 * Updates articles directly tied to an article
 * @param {any} database - The Knex object for the databse to update
 * @param {string} keyField - A String which indicates which db field is used as the primary key in jsonGraphArg
 * @param {Object} jsonGraphArg - An object of type { [keyFields]: articleUpdateObject[] }
 * @returns {Promise<boolean>} - Whether the update was a success
 */
export async function updateArticles(database, keyField, jsonGraphArg) {
  const articlesWithChangedCategory = [];
  const updatePromises = _.map(jsonGraphArg, (articleUpdater, key) => {
    const processedArticleUpdater = {
      ...articleUpdater,
    };
    if (has.call(processedArticleUpdater, 'category')) {
      // Rename it to category_id and note that this article had it's category changed
      processedArticleUpdater.category_id = processedArticleUpdater.category;
      delete processedArticleUpdater.category;
      articlesWithChangedCategory.push(key);
    }
    return database('articles')
      .where(keyField, '=', key)
      .update(processedArticleUpdater);
  });
  await Promise.all(updatePromises);
  // If categories changed make sure issue data is still consistent
  if (articlesWithChangedCategory.length > 0) {
    const issueRows = await database
      .distinct('issue_id')
      .select()
      .from('issues_articles_order')
      .innerJoin(
        'articles',
        'articles.id',
        '=',
        'issues_articles_order.article_id',
      )
      .whereIn(`articles.${keyField}`, articlesWithChangedCategory);

    const issuesToUpdate = issueRows.map(row => row.issue_id);
    // If the articles were actually published in any issues
    if (issuesToUpdate.length > 0) {
      const flag = await orderArticlesInIssues(database, issuesToUpdate);
      if (!flag) {
        const msg = `error while reordering articles in issues: ${JSON.stringify(
          issuesToUpdate,
        )}`;
        throw new Error(msg);
      }
    }
  }

  // It hasn't thrown an error yet so it must have been a success
  return true;
}

/**
 * Fetches direct meta data of articles from the articles database table
 * @param {any} database - The Knex object for the databse to update
 * @param {string} queryField - Indicates which field to query by
 * @param {string[]} queryParams - Array of parameters of type queryField of articles to fetch
 * @param {string[]} columns - Which columns of the articles table to fetch
 * @returns {Promise<Object[]>}
 */
export function articleQuery(database, queryField, queryParams, columns) {
  // In order to be able to identify the rows we get back we need to include the queryField
  if (!columns.includes(queryField)) {
    columns.push(queryField);
  }
  return database
    .select(...columns)
    .from('articles')
    .whereIn(queryField, queryParams);
}
