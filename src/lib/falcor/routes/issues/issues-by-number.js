import falcor from 'falcor';
import _ from 'lodash';

import DbFunctions from 'lib/db';

const db = new DbFunctions();
const $ref = falcor.Model.ref;

export default [
  {
    // get featured article
    route: "issuesByNumber[{integers:issueNumbers}]['featured']",
    get: (pathSet) => (
      new Promise((resolve) => {
        db.featuredArticleQuery(pathSet.issueNumbers).then((data) => {
          const results = [];
          data.forEach((row) => {
            results.push({
              path: ['issuesByNumber', row.issue_order, 'featured'],
              value: $ref(['articlesBySlug', row.slug]),
            });
          });
          resolve(results);
        });
      })
    ),
  },
  {
    // get editor's picks
    route: "issuesByNumber[{integers:issueNumbers}]['picks'][{integers:indices}]",
    get: (pathSet) => (
      new Promise((resolve) => {
        db.editorPickQuery(pathSet.issueNumbers).then((data) => {
          const results = [];
          _.forEach(data, (postSlugArray, issueNumber) => {
            pathSet.indices.forEach((index) => {
              if (index < postSlugArray.length) {
                results.push({
                  path: ['issuesByNumber', issueNumber, 'picks', index],
                  value: $ref(['articlesBySlug', postSlugArray[index]]),
                });
              }
            });
          });
          resolve(results);
        });
      })
    ),
  },
  {
    // Get articles category information from articles.
    /* This is a special case as it actually makes us store a bit of information twice
      But we can't just give a ref here since because the articles of a category is different
      depending on whether it is fetched directly from categories which is ordered chronologically
      and all articles from that category are fetched or from an issue where it is ordered by
      editor tools */
    route: "issuesByNumber[{integers:issueNumbers}]['categories'][{integers:indices}]['id', 'name', 'slug']", // eslint-disable-line max-len
    get: (pathSet) => (
      new Promise((resolve) => {
        const requestedFields = pathSet[4];
        db.issueCategoryQuery(pathSet.issueNumbers, requestedFields).then((data) => {
          // data is an object with keys of issue numbers and values
          // arrays of category objects in correct order as given in editor tools
          const results = [];
          _.forEach(data, (categorySlugArray, issueNumber) => {
            pathSet.indices.forEach((index) => {
              if (index < categorySlugArray.length) {
                requestedFields.forEach((field) => {
                  results.push({
                    path: ['issuesByNumber', issueNumber, 'categories', index, field],
                    value: categorySlugArray[index][field],
                  });
                });
              }
            });
          });
          resolve(results);
        });
      })
    ),
  },
  {
    // Get articles within issue categories
    route: "issuesByNumber[{integers:issueNumbers}]['categories'][{integers:categoryIndices}]['articles'][{integers:articleIndices}]", // eslint-disable-line max-len
    get: (pathSet) => (
      // This will currently fetch every single article from the issue
      // every time, and then just only return the ones asked for
      // which shouldn't at all be a problem at current capacity of
      // 10-20 articles an issue.
      new Promise((resolve) => {
        db.issueCategoryArticleQuery(pathSet.issueNumbers).then((data) => {
          // data is an object with keys equal to issueNumbers and values
          // being an array of arrays, the upper array being the categories
          // in their given order, and the lower level array within each category
          // is article slugs also in their given order.
          const results = [];
          _.forEach(data, (categoryArray, issueNumber) => {
            pathSet.categoryIndices.forEach((categoryIndex) => {
              if (categoryIndex < categoryArray.length) {
                pathSet.articleIndices.forEach((articleIndex) => {
                  if (articleIndex < categoryArray[categoryIndex].length) {
                    results.push({
                      path:
                        ['issuesByNumber', issueNumber,
                        'categories', categoryIndex,
                        'articles', articleIndex],
                      value: $ref(['articlesBySlug', categoryArray[categoryIndex][articleIndex]]),
                    });
                  }
                });
              }
            });
          });
          resolve(results);
        });
      })
    ),
  },
  {
    // Get issue data
    route: "issuesByNumber[{integers:issueNumbers}]['id', 'published_at', 'name', 'issueNumber']",
    get: (pathSet) => {
      const mapFields = (field) => {
        switch (field) {
          case 'issueNumber':
            return 'issue_order';
          default:
            return field;
        }
      };
      return new Promise((resolve) => {
        const requestedFields = pathSet[2];
        const dbColumns = requestedFields.map(mapFields);
        db.issueQuery(pathSet.issueNumbers, dbColumns).then((data) => {
          const results = [];
          data.forEach((issue) => {
            // Convert Date object to time integer
            const processedIssue = { ...issue };
            if (
              processedIssue.hasOwnProperty('published_at') &&
              processedIssue.published_at instanceof Date
            ) {
              processedIssue.published_at = processedIssue.published_at.getTime();
            }
            requestedFields.forEach((field) => {
              results.push({
                path: ['issuesByNumber', processedIssue.issue_order, field],
                value: processedIssue[mapFields(field)],
              });
            });
          });
          resolve(results);
        });
      });
    },
    set: (jsonGraphArg) => (
      new Promise((resolve) => {
        const issueNumber = Object.keys(jsonGraphArg.issuesByNumber)[0];
        const issueObject = jsonGraphArg.issuesByNumber[issueNumber];
        db.updateIssueData(jsonGraphArg).then((flag) => {
          if (flag !== true) {
            throw new Error('Error while updating issue data');
          }
          resolve([{
            path: ['issuesByNumber', parseInt(issueNumber, 10), 'published_at'],
            value: issueObject.published_at,
          }, {
            path: ['latestIssue'],
            invalidated: true,
          }]);
        });
      })
    ),
  },
  {
    route: "issuesByNumber['updateIssueArticles']",
    call: (callPath, args) => (
      new Promise((resolve) => {
        const issueNumber = args[0];
        const featuredArticles = args[1];
        const picks = args[2];
        const mainArticles = args[3];
        db.updateIssueArticles(issueNumber, featuredArticles, picks, mainArticles)
        .then((data) => {
          let results = [];
          const toAdd = data.data;
          const toInvalidate = data.invalidated;
          // Build the return array from the structure we know it returns
          // from db.js
          if (toInvalidate) {
            results = results.concat(toInvalidate);
          }
          if (toAdd.hasOwnProperty('featured')) {
            results.push(toAdd.featured);
          }
          if (toAdd.hasOwnProperty('picks')) {
            results = results.concat(toAdd.picks);
          }
          if (toAdd.hasOwnProperty('categories')) {
            _.forEach(toAdd.categories, (category, key) => {
              results.push({
                path: ['issuesByNumber', issueNumber, 'categories', key, 'name'],
                value: category.name,
              });
              results.push({
                path: ['issuesByNumber', issueNumber, 'categories', key, 'slug'],
                value: category.slug,
              });
              results = results.concat(category.articles);
            });
          }
          if (toAdd.hasOwnProperty('published')) {
            results = results.concat(toAdd.published);
          }
          resolve(results);
        });
      })
    ),
  },
  {
    route: "issuesByNumber[{integers:issueNumbers}]['updateIssueCategories']",
    call: (callPath, args) => (
      new Promise((resolve) => {
        const issueNumber = callPath.issueNumbers[0];
        const idArray = args[0];
        db.updateIssueCategories(issueNumber, idArray).then((flag) => {
          if (flag !== true) {
            throw new Error('updateIssueCategories returned non-true flag');
          }
          const results = [
            {
              path: ['placeholder'],
              value: 'placeholder',
            },
            {
              path: ['issuesByNumber', issueNumber, 'categories'],
              invalidated: true,
            },
          ];
          resolve(results);
        });
      })
    ),
  },
  {
    route: "issuesByNumber[{integers:issueNumbers}]['publishIssue']",
    call: (callPath, args) => (
      new Promise((resolve) => {
        const issueId = args[0];
        const issueNumber = callPath.issueNumbers[0];
        db.publishIssue(issueId).then((data) => {
          const results = [];
          const publishTime = data.date.getTime();
          results.push({
            path: ['issuesByNumber', issueNumber, 'published_at'],
            value: publishTime,
          });
          data.publishedArticles.forEach((slug) => {
            results.push({
              path: ['articlesBySlug', slug, 'published_at'],
              value: publishTime,
            });
          });
          resolve(results);
        });
      })
    ),
  },
  {
    route: "issuesByNumber['addIssue']",
    call: (callPath, args) => (
      new Promise((resolve) => {
        const issue = args[0];
        const fields = Object.keys(issue);
        db.addIssue(issue).then((flag) => {
          if (flag !== true) {
            throw new Error('For some reason addIssue db function returned a non-true flag');
          }
          const results = [];
          fields.forEach((field) => {
            results.push({
              path: ['issuesByNumber', issue.issueNumber, field],
              value: issue[field],
            });
          });
          results.push({
            path: ['latestIssue'],
            invalidated: true,
          });
          resolve(results);
        });
      })
    ),
  },
];
