import falcor from 'falcor';
import _ from 'lodash';

import * as db from 'lib/db';
import { has } from 'lib/utilities';

const $ref = falcor.Model.ref;

export default [
  {
    // get featured article
    route: "issues['byNumber'][{integers:issueNumbers}]['featured']",
    get: pathSet =>
      new Promise(resolve => {
        db.featuredArticleQuery(pathSet.issueNumbers).then(data => {
          const results = [];
          data.forEach(row => {
            results.push({
              path: ['issues', 'byNumber', row.issue_number, 'featured'],
              value: $ref(['articles', 'bySlug', row.slug]),
            });
          });
          resolve(results);
        });
      }),
  },
  {
    // get editor's picks
    route:
      "issues['byNumber'][{integers:issueNumbers}]['picks'][{integers:indices}]",
    get: pathSet =>
      new Promise(resolve => {
        db.editorPickQuery(pathSet.issueNumbers).then(data => {
          const results = [];
          _.forEach(data, (postSlugArray, issueNumber) => {
            pathSet.indices.forEach(index => {
              if (index < postSlugArray.length) {
                results.push({
                  path: ['issues', 'byNumber', issueNumber, 'picks', index],
                  value: $ref(['articles', 'bySlug', postSlugArray[index]]),
                });
              }
            });
          });
          resolve(results);
        });
      }),
  },
  {
    // Get articles category information from articles.
    /* This is a special case as it actually makes us store a bit of information twice
      But we can't just give a ref here since because the articles of a category is different
      depending on whether it is fetched directly from categories which is ordered chronologically
      and all articles from that category are fetched or from an issue where it is ordered by
      editor tools */
    route:
      "issues['byNumber'][{integers:issueNumbers}]['categories'][{integers:indices}]['id', 'name', 'slug']", // eslint-disable-line max-len
    get: pathSet =>
      new Promise(resolve => {
        const requestedFields = pathSet[5];
        db.issueCategoryQuery(pathSet.issueNumbers, requestedFields).then(
          data => {
            // data is an object with keys of issue numbers and values
            // arrays of category objects in correct order as given in editor tools
            const results = [];
            _.forEach(data, (categorySlugArray, issueNumber) => {
              pathSet.indices.forEach(index => {
                if (index < categorySlugArray.length) {
                  requestedFields.forEach(field => {
                    results.push({
                      path: [
                        'issues',
                        'byNumber',
                        issueNumber,
                        'categories',
                        index,
                        field,
                      ],
                      value: categorySlugArray[index][field],
                    });
                  });
                }
              });
            });
            resolve(results);
          },
        );
      }),
  },
  {
    // Get articles within issue categories
    route:
      "issues['byNumber'][{integers:issueNumbers}]['categories'][{integers:categoryIndices}]['articles'][{integers:articleIndices}]", // eslint-disable-line max-len
    get: pathSet =>
      // This will currently fetch every single article from the issue
      // every time, and then just only return the ones asked for
      // which shouldn't at all be a problem at current capacity of
      // 10-20 articles an issue.
      new Promise(resolve => {
        db.issueCategoryArticleQuery(pathSet.issueNumbers).then(data => {
          // data is an object with keys equal to issueNumbers and values
          // being an array of arrays, the upper array being the categories
          // in their given order, and the lower level array within each category
          // is article slugs also in their given order.
          const results = [];
          _.forEach(data, (categoryArray, issueNumber) => {
            pathSet.categoryIndices.forEach(categoryIndex => {
              if (categoryIndex < categoryArray.length) {
                pathSet.articleIndices.forEach(articleIndex => {
                  if (articleIndex < categoryArray[categoryIndex].length) {
                    results.push({
                      path: [
                        'issues',
                        'byNumber',
                        issueNumber,
                        'categories',
                        categoryIndex,
                        'articles',
                        articleIndex,
                      ],
                      value: $ref([
                        'articles',
                        'bySlug',
                        categoryArray[categoryIndex][articleIndex],
                      ]),
                    });
                  }
                });
              }
            });
          });
          resolve(results);
        });
      }),
  },
  {
    // Get issue data
    // eslint-disable-next-line max-len
    route:
      "issues['byNumber'][{integers:issueNumbers}]['id', 'published_at', 'name', 'issueNumber']",
    get: pathSet => {
      const mapFields = field => {
        switch (field) {
          case 'issueNumber':
            return 'issue_number';
          default:
            return field;
        }
      };
      return new Promise(resolve => {
        const requestedFields = pathSet[3];
        const dbColumns = requestedFields.map(mapFields);
        db.issueQuery(pathSet.issueNumbers, dbColumns).then(data => {
          const results = [];
          data.forEach(issue => {
            // Convert Date object to time integer
            const processedIssue = { ...issue };
            if (
              has.call(processedIssue, 'published_at') &&
              processedIssue.published_at instanceof Date
            ) {
              processedIssue.published_at = processedIssue.published_at.getTime();
            }
            requestedFields.forEach(field => {
              results.push({
                path: [
                  'issues',
                  'byNumber',
                  processedIssue.issue_number,
                  field,
                ],
                value: processedIssue[mapFields(field)],
              });
            });
          });
          resolve(results);
        });
      });
    },
    set: jsonGraphArg =>
      new Promise(resolve => {
        const issueNumber = Object.keys(jsonGraphArg.issues.byNumber)[0];
        const issueObject = jsonGraphArg.issues.byNumber[issueNumber];
        const results = [];
        db.updateIssueData(jsonGraphArg).then(flag => {
          if (flag !== true) {
            throw new Error('Error while updating issue data');
          }
          _.forEach(issueObject, (value, field) => {
            results.push({
              path: ['issues', 'byNumber', parseInt(issueNumber, 10), field],
              value,
            });
          });
          results.push({
            path: ['issues', 'latest'],
            invalidated: true,
          });
          resolve(results);
        });
      }),
  },
  {
    route: "issues['byNumber']['updateIssueArticles']",
    call: (callPath, args) =>
      new Promise(resolve => {
        const issueNumber = args[0];
        const featuredArticles = args[1];
        const picks = args[2];
        const mainArticles = args[3];
        db.updateIssueArticles(
          issueNumber,
          featuredArticles,
          picks,
          mainArticles,
        ).then(data => {
          let results = [];
          const toAdd = data.data;
          const toInvalidate = data.invalidated;
          // Build the return array from the structure we know it returns
          // from db.js
          if (toInvalidate) {
            results = results.concat(toInvalidate);
          }
          if (has.call(toAdd, 'featured')) {
            results.push(toAdd.featured);
          }
          if (has.call(toAdd, 'picks')) {
            results = results.concat(toAdd.picks);
          }
          if (has.call(toAdd, 'categories')) {
            _.forEach(toAdd.categories, (category, key) => {
              results.push({
                path: [
                  'issues',
                  'byNumber',
                  issueNumber,
                  'categories',
                  key,
                  'name',
                ],
                value: category.name,
              });
              results.push({
                path: [
                  'issues',
                  'byNumber',
                  issueNumber,
                  'categories',
                  key,
                  'slug',
                ],
                value: category.slug,
              });
              results = results.concat(category.articles);
            });
          }
          if (has.call(toAdd, 'published')) {
            results = results.concat(toAdd.published);
          }
          resolve(results);
        });
      }),
  },
  {
    route:
      "issues['byNumber'][{integers:issueNumbers}]['updateIssueCategories']",
    call: (callPath, args) =>
      new Promise(resolve => {
        const issueNumber = callPath.issueNumbers[0];
        const idArray = args[0];
        db.updateIssueCategories(issueNumber, idArray).then(flag => {
          if (flag !== true) {
            throw new Error('updateIssueCategories returned non-true flag');
          }
          const results = [
            {
              path: ['placeholder'],
              value: 'placeholder',
            },
            {
              path: ['issues', 'byNumber', issueNumber, 'categories'],
              invalidated: true,
            },
          ];
          resolve(results);
        });
      }),
  },
  {
    route: "issues['byNumber'][{integers:issueNumbers}]['publishIssue']",
    call: (callPath, args) =>
      new Promise(resolve => {
        const issueId = args[0];
        const issueNumber = callPath.issueNumbers[0];
        db.publishIssue(issueId).then(data => {
          const results = [];
          const publishTime = data.date.getTime();
          results.push({
            path: ['issues', 'byNumber', issueNumber, 'published_at'],
            value: publishTime,
          });
          data.publishedArticles.forEach(slug => {
            results.push({
              path: ['articles', 'bySlug', slug, 'published_at'],
              value: publishTime,
            });
          });
          resolve(results);
        });
      }),
  },
  {
    route: "issues['byNumber']['addIssue']",
    call: (callPath, args) =>
      new Promise((resolve, reject) => {
        const issue = args[0];
        verifyIssue(issue);
        const fields = Object.keys(issue);
        db.addIssue(issue)
          .then(flag => {
            if (flag !== true) {
              throw new Error(
                'For some reason addIssue db function returned a non-true flag',
              );
            }
            const results = [];
            fields.forEach(field => {
              results.push({
                path: ['issues', 'byNumber', issue.issue_number, field],
                value: issue[field],
              });
            });
            results.push({
              path: ['issues', 'latest'],
              invalidated: true,
            });
            resolve(results);
          })
          .catch(reject);
      }),
  },
];

function verifyIssue(issue) {
  const requiredFields = ['name', 'issue_number'];
  const optionalFields = ['published_at'];
  requiredFields.every(field => {
    if (!has.call(issue, field)) {
      throw new Error(`Required field ${field} was not present`);
    }
    return true;
  });
  const allFields = requiredFields.concat(optionalFields);
  Object.keys(issue).every(issueField => {
    if (!allFields.includes(issueField)) {
      throw new Error(`Unknown field ${issueField} was found on issue`);
    }
    return true;
  });
}
