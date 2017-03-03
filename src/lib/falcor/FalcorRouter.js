import BaseRouter from "falcor-router";
import { ghostArticleQuery } from 'lib/ghostAPI';
import dbFunctions from 'lib/db';
import falcor from 'falcor';
import _ from 'lodash';

const $ref = falcor.Model.ref;

export const mapGhostNames = (falcorName) => {
  switch (falcorName) {
    case "teaser":
      return "meta_description";
    case "issueNumber":
      return "issue_order";
    default:
      return falcorName;
  }
}

// This is just a cleaner way to import all the functions from db.js
// compared to listing all the 20+ functions exported from there
const db = new dbFunctions();

export default class FalcorRouter extends BaseRouter.createClass([
  {
    route: "infoPages[{keys:slugs}]['title', 'html', 'slug']",
    get: (pathSet) => {
      return new Promise((resolve) => {
        const requestedFields = pathSet[2];
        db.infoPagesQuery(pathSet.slugs, requestedFields).then((data) => {
          // data function parameter is an array of objects with keys equal to the columns requested.
          // Always returns the slug so we know which one we got
          const results = [];
          data.forEach((row) => {
            requestedFields.forEach((key) => {
              if (!row.hasOwnProperty(key)) {
                throw new Error("missing data in infoPages, it is not even null, simply doesn't return");
              }
              else {
                results.push({
                  path: ['infoPages', row.slug, key],
                  value: row[key],
                });
              }
            });
          });
          resolve(results);
        });
      });
    },
  },
  {
    route: "authorsBySlug[{keys:slugs}]['id', 'name', 'image', 'biography', 'slug', 'job_title']",
    get: (pathSet) => {
      return new Promise((resolve) => {
        const requestedFields = pathSet[2];
        db.authorQuery(pathSet.slugs, requestedFields).then((data) => {
          // always returns slug in the object no matter what.
          const results = [];
          data.forEach((author) => {
            requestedFields.forEach((field) => {
              results.push({
                path: ["authorsBySlug", author.slug, field],
                value: author[field],
              });
            });
          });
          resolve(results);
        });
      });
    },
    set: (jsonGraphArg) => {
      return new Promise((resolve, reject) => {
        const authorsBySlug = jsonGraphArg.authorsBySlug;
        db.updateMainAuthorData(authorsBySlug).then((flag) => {
          if (!flag) {
            throw new Error("For unknown reasons updateMainAuthorData returned a non-true flag");
          }
          const results = [];
          _.forEach(authorsBySlug, (authorObject, slug) => {
            _.forEach(authorObject, (value, field) => {
              results.push({
                path: ['authorsBySlug', slug, field],
                value: value,
              });
            });
          });
          resolve(results);
        })
        .catch((e) => {
          reject(e);
        });
      });
    },
  },
  {
    route: "authorsBySlug[{keys:slugs}]['teams'][{integers:indices}]",
    get: (pathSet) => {
      return new Promise((resolve) => {
        db.authorTeamQuery(pathSet.slugs).then((data) => {
          const results = [];
          _.forEach(data, (teamSlugArray, authorSlug) => {
            pathSet.indices.forEach((index) => {
              if (index < teamSlugArray.length) {
                results.push({
                  path: ['authorsBySlug', authorSlug, 'teams', index],
                  value: $ref(['teamsBySlug', teamSlugArray[index]]),
                });
              }
            });
          });
          resolve(results);
        })
      });
    },
  },
  {
    route: "authorsBySlug[{keys:slugs}]['articles'][{integers:indices}]",
    // This could be a bit vulnerable as it fetches all articles written by an author
    // no matter what indices are called, but I think in reality it shouldn't be a problem
    get: (pathSet) => {
      return new Promise((resolve) => {
        db.authorArticleQuery(pathSet.slugs).then((data) => {
          // We receive the data as an object with keys equalling author slugs
          // and values being an array of article slugs where the most recent is first
          const results = [];
          _.forEach(data, (postSlugArray, authorSlug) => {
            pathSet.indices.forEach((index) => {
              if (index < postSlugArray.length) {
                results.push({
                  path: ['authorsBySlug', authorSlug, 'articles', index],
                  value: $ref(['articlesBySlug', postSlugArray[index]]),
                });
              }
            });
          });
          resolve(results);
        })
      });
    },
  },
  {
    route: "authorsBySlug['createAuthor']",
    call: (callPath, args) => {
      return new Promise((resolve) => {
        const authorObject = args[0];
        if (!(authorObject.hasOwnProperty('slug') && authorObject.hasOwnProperty('name'))) {
          throw new Error("When creating an author you must provide both name and slug");
        }
        db.createAuthor(authorObject).then((flag) => {
          if (flag !== true) {
            throw new Error("Create Author function returned non-true flag");
          }
          const results = [];
          const authorSlug = authorObject.slug;
          _.forEach(authorObject, (value, field) => {
            results.push({
              path: ['authorsBySlug', authorSlug, field],
              value: value,
            });
          });
          resolve(results);
        });
      });
    },
  },
  {
    // Get article data from Ghost API
    route: "articlesBySlug[{keys:slugs}]['id', 'image', 'slug', 'title', 'markdown', 'html', 'teaser']",
    get: (pathSet) => {
      return new Promise((resolve) => {
        const requestedFields = pathSet[2];
        let query = "filter=";
        pathSet.slugs.forEach((slug, index) => {
          query += (index > 0 ? "," : "") + "slug:" + slug;
        });
        query += "&fields=slug"
        requestedFields.forEach((field) => {
          if (field !== 'slug') {
            query += "," + mapGhostNames(field);
          }
        })
        query += "&limit=" + pathSet.slugs.length.toString();
        ghostArticleQuery(query).then((data) => {
          data = data.posts;
          const results = [];
          data.forEach((article) => {
            requestedFields.forEach((field) => {
              let ghostField = mapGhostNames(field);
              results.push({
                path: ["articlesBySlug", article.slug, field],
                value: article[ghostField],
              });
            });
          });
          resolve(results);
        });
      });
    },
    set: (jsonGraphArg) => {
      return new Promise((resolve) => {
        const articlesBySlug = jsonGraphArg.articlesBySlug;
        const slugs = Object.keys(articlesBySlug);
        db.updateGhostFields(articlesBySlug).then((flag) => {
          const results = [];
          if (flag !== true) {
            throw new Error("For unknown reasons updateGhostFields returned a non-true flag");
          }
          slugs.forEach((slug) => {
            const slugObject = articlesBySlug[slug];
            _.forEach(slugObject, (value, field) => {
              results.push({
                path: ['articlesBySlug', slug, field],
                value: value,
              });
            });
          });
          resolve(results);
        });
      });
    },
  },
  {
    // Get custom article data from MariaDB
    route: "articlesBySlug[{keys:slugs}]['category', 'published_at', 'views']",
    get: (pathSet) => {
      return new Promise((resolve) => {
        const requestedFields = pathSet[2];
        db.articleQuery(pathSet.slugs, requestedFields).then((data) => {
          const results = [];
          data.forEach((article) => {
            if (article.hasOwnProperty('published_at') && (article.published_at instanceof Date)) {
              article.published_at = article.published_at.getTime();
            }
            requestedFields.forEach((field) => {
              results.push({
                path: ["articlesBySlug", article.slug, field],
                value: article[field],
              });
            });
          });
          resolve(results);
        });
      });
    },
    set: (jsonGraphArg) => {
      return new Promise((resolve) => {
        const articlesBySlug = jsonGraphArg.articlesBySlug;
        const slugs = Object.keys(articlesBySlug);
        const results = [];
        db.updatePostMeta(articlesBySlug)
        .then((flag) => {
          if (!flag) {
            throw new Error("For unknown reasons updatePostMeta returned a non-true flag");
          }
          slugs.forEach((slug) => {
            const slugObject = articlesBySlug[slug];
            _.forEach(slugObject, (value, field) => {
              results.push({
                path: ['articlesBySlug', slug, field],
                value: value,
              });
            });
          });
          resolve(results);
        });
      });
    },
  },
  {
    // Get issueNumber from database
    route: "articlesBySlug[{keys:slugs}]['issueNumber']",
    get: (pathSet) => {
      return new Promise((resolve) => {
        db.articleIssueQuery(pathSet.slugs).then((data) => {
          const results = [];
          data.forEach((row) => {
            results.push({
              path: ["articlesBySlug", row.slug, 'issueNumber'],
              value: row.issueNumber,
            });
          });
          resolve(results);
        })
      })
    },
    set: (jsonGraphArg) => {
      return new Promise((resolve) => {
        const articlesBySlug = jsonGraphArg.articlesBySlug;
        const slugs = Object.keys(articlesBySlug);
        const results = [];
        slugs.forEach((slug) => {
          results.push({
            path: ['articlesBySlug', slug, 'issueNumber'],
            value: articlesBySlug[slug].issueNumber,
          });
        });
        resolve(results);
      });
    },
  },
  {
    // Get author information from article
    route: "articlesBySlug[{keys:slugs}]['authors'][{integers:indices}]",
    get: (pathSet) => {
      return new Promise((resolve) => {
        db.articleAuthorQuery(pathSet.slugs).then((data) => {
          // We receive the data as an object with keys equalling article slugs
          // and values being an array of author slugs in no particular order
          const results = [];
          _.forEach(data, (authorSlugArray, postSlug) => {
            pathSet.indices.forEach((index) => {
              if (index < authorSlugArray.length) {
                results.push({
                  path: ['articlesBySlug', postSlug, 'authors', index],
                  value: $ref(['authorsBySlug', authorSlugArray[index]]),
                });
              }
            });
          });
          resolve(results);
        })
      });
    },
  },
  {
    // Add authors to an article
    route: "articlesBySlug[{keys:slugs}]['authors']['updateAuthors']",
    call: (callPath, args) => {
      // the falcor.model.call only takes a path not a pathset
      // so it is not possible to call this function for more
      // than 1 article at a time, therefore we know keys:slugs is length 1
      if (callPath.slugs > 1) {
        throw new Error("updateAuthors falcor function was called illegally with more than 1 article slug");
      }
      return new Promise((resolve) => {
        const articleId = args[0];
        const newAuthors = args[1];
        const articleSlug = callPath.slugs[0];
        db.updateAuthors(articleId, newAuthors).then((data) => {
          const results = [];
          // Invalidate all the old data
          results.push({
            path: ['articlesBySlug', articleSlug, 'authors'],
            invalidated: true,
          });
          data.forEach((slug, index) => {
            results.push({
              path: ['articlesBySlug', articleSlug, 'authors', index],
              value: $ref(['authorsBySlug', slug]),
            });
          });
          resolve(results);
        });
      });
    },
  },
  {
    // Get related articles
    route: "articlesBySlug[{keys:slugs}]['related'][{integers:indices}]",
    get: (pathSet) => {
      return new Promise((resolve) => {
        // The dbRelatedArticleQuery function will only return 3 related articles
        // per article queried right now (as you shouldn't need more),
        // so you cannot request an index higher than 2
        db.relatedArticleQuery(pathSet.slugs).then((data) => {
          const results = [];
          pathSet.slugs.forEach((slug) => {
            pathSet.indices.forEach((index) => {
              if (data.hasOwnProperty(slug) && index < data[slug].length) {
                results.push({
                  path: ['articlesBySlug', slug, 'related', index],
                  value: $ref(['articlesBySlug', data[slug][index]]),
                });
              }
            });
          });
          resolve(results);
        });
      });
    },
  },
  {
    route: "articlesBySlug[{keys:slugs}]['addView']",
    call: (callPath) => {
      return new Promise((resolve) => {
        // It's a function call so there should only be one slug
        if (callPath.slugs.length !== 1) {
          throw new Error("addView route was called with " + callPath.slugs.length.toString()
            + " slugs, there should only be 1");
        }
        const slug = callPath.slugs[0];
        db.addView(slug).then((views) => {
          if (views === false) {
            // Means the article wasn't found
            resolve([]);
          }
          else if (!views || (typeof views) !== 'number') {
            throw new Error("addView for slug " + slug + " returned unexpected value");
          }
          else {
            resolve([{
              path: ['articlesBySlug', slug, 'views'],
              value: views,
            }]);
          }
        });
      });
    },
  },
  {
    /*
    Get articles by page (they are also in chronological order, articlesByPage[pageLength][1][0]
    is the latest published article to the Ghost database). Only use positive integer page lengths
    and page numbers, and non-negative page indices. [{integers:indicesOnPage}] is logically redundant
    but needed for working properly with falcor. Normal falcorPath syntax would be:
    articlesByPage[pageLength][pageNumber][{length: pageLength}]
    where {length: pageLength} makes use of falcor's range object.
    */
    route: "articlesByPage[{integers:pageLengths}][{integers:pageNumbers}][{integers:indicesOnPage}]",
    get: (pathSet) => {
      return new Promise((resolve) => {
        const results = [];
        const numberOfQueryCalls = pathSet.pageLengths.length*pathSet.pageNumbers.length;
        if (numberOfQueryCalls === 0) return [];
        let queriesResolved = 0;
        pathSet.pageLengths.forEach((pageLength) => {
          if (pageLength < 1) {
            throw new Error("Cannot pass nonpositive integer as the pageLength parameter. You passed " + pageLength.toString() + " as one of your page lengths.");
          }
          pathSet.pageNumbers.forEach((pageNumber) => {
            if (pageNumber < 1) {
              throw new Error("Cannot pass nonpositive integer as the pageNumber parameter. You passed " + pageNumber.toString() + " as one of your page numbers.");
            }
            const query = "limit="+pageLength.toString()+"&page="+pageNumber.toString()+"&fields=slug";
            ghostArticleQuery(query).then((data) => {
              if (data.hasOwnProperty("errors")) {
                throw new Error("Errors in the Ghost API query with query parameter = " + query + ": " + JSON.stringify(data));
              }
              const articles = data.posts;
              pathSet.indicesOnPage.forEach((index) => {
                if (index < 0) {
                  throw new Error("You cannot pass negative indices to the indexOnPage parameter. You passed " + index.toString() + " as one of your indices.");
                }
                if (index < articles.length) {
                  results.push({
                    path: ['articlesByPage', pageLength, pageNumber, index],
                    value: $ref(['articlesBySlug', articles[index].slug]),
                  });
                }
              });
              queriesResolved++;
              if (queriesResolved === numberOfQueryCalls) {
                resolve(results);
              }
            }).catch((err) => {
              // figure out what you should actually do here
              throw(err);
            });
          });
        });
      });
    },
  },
  {
    // get categories name
    route: "categoriesBySlug[{keys:slugs}]['name', 'slug']",
    get: (pathSet) => {
      return new Promise((resolve) => {
        const requestedFields = pathSet[2];
        db.categoryQuery(pathSet.slugs, requestedFields).then((data) => {
          const results = [];
          data.forEach((category) => {
            requestedFields.forEach((field) => {
              results.push({
                path: ['categoriesBySlug', category.slug, field],
                value: category[field],
              });
            })
          });
          resolve(results);
        });
      });
    },
  },
  {
    // get articles in a category
    route: "categoriesBySlug[{keys:slugs}]['articles'][{integers:indices}]",
    get: (pathSet) => {
      return new Promise((resolve) => {
        db.categoryArticleQuery(pathSet.slugs).then((data) => {
          // We receive the data as an object with keys equalling category slugs
          // and values being an array of article slugs where the most recent is first
          const results = [];
          _.forEach(data, (postSlugArray, categorySlug) => {
            pathSet.indices.forEach((index) => {
              if (index < postSlugArray.length) {
                results.push({
                  path: ['categoriesBySlug', categorySlug, 'articles', index],
                  value: $ref(['articlesBySlug', postSlugArray[index]]),
                });
              }
            });
          });
          resolve(results);
        });
      });
    },
  },
  {
    // get categories by index
    route: "categoriesByIndex[{integers:indices}]",
    get: (pathSet) => {
      return new Promise((resolve) => {
        // This will fetch every single category at this time which shouldn't
        // at all be a problem at this capacity
        db.categoryArrayQuery().then((data) => {
          // This function resolves an array of slugs
          const results = [];
          pathSet.indices.forEach((index) => {
            if (index < data.length) {
              results.push({
                path: ['categoriesByIndex', index],
                value: $ref(['categoriesBySlug', data[index]]),
              });
            }
          });
          resolve(results);
        });
      });
    },
  },
  {
    // get featured article
    route: "issuesByNumber[{integers:issueNumbers}]['featured']",
    get: (pathSet) => {
      return new Promise((resolve) => {
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
      });
    },
  },
  {
    // get editor's picks
    route: "issuesByNumber[{integers:issueNumbers}]['picks'][{integers:indices}]",
    get: (pathSet) => {
      return new Promise((resolve) => {
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
      });
    },
  },
  {
    // Get articles category information from articles.
    /* This is a special case as it actually makes us store a bit of information twice
      But we can't just give a ref here since because the articles of a category is different
      depending on whether it is fetched directly from categories which is ordered chronologically
      and all articles from that category are fetched or from an issue where it is ordered by editor tools */
    route: "issuesByNumber[{integers:issueNumbers}]['categories'][{integers:indices}]['id', 'name', 'slug']",
    get: (pathSet) => {
      return new Promise((resolve) => {
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
                })
              }
            });
          });
          resolve(results);
        })
      });
    },
  },
  {
    // Get articles within issue categories
    route: "issuesByNumber[{integers:issueNumbers}]['categories'][{integers:categoryIndices}]['articles'][{integers:articleIndices}]",
    get: (pathSet) => {
      // This will currently fetch every single article from the issue
      // every time, and then just only return the ones asked for
      // which shouldn't at all be a problem at current capacity of
      // 10-20 articles an issue.
      return new Promise((resolve) => {
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
                      path: ['issuesByNumber', issueNumber, 'categories', categoryIndex, 'articles', articleIndex],
                      value: $ref(['articlesBySlug', categoryArray[categoryIndex][articleIndex]]),
                    });
                  }
                });
              }
            });
          });
          resolve(results);
        })
      });
    },
  },
  {
    // Get issue data
    route: "issuesByNumber[{integers:issueNumbers}]['id', 'published_at', 'name', 'issueNumber']",
    get: (pathSet) => {
      const mapFields = (field) => {
        switch (field) {
          case "issueNumber":
            return "issue_order";
          default:
            return field;
        }
      }
      return new Promise((resolve) => {
        const requestedFields = pathSet[2];
        const dbColumns = requestedFields.map(mapFields);
        db.issueQuery(pathSet.issueNumbers, dbColumns).then((data) => {
          const results = [];
          data.forEach((issue) => {
            // Convert Date object to time integer
            if (issue.hasOwnProperty('published_at') && (issue.published_at instanceof Date)) {
              issue.published_at = issue.published_at.getTime();
            }
            requestedFields.forEach((field) => {
              results.push({
                path: ['issuesByNumber', issue.issue_order, field],
                value: issue[mapFields(field)],
              });
            });
          });
          resolve(results);
        });
      });
    },
    set: (jsonGraphArg) => {
      return new Promise((resolve) => {
        const issueNumber = Object.keys(jsonGraphArg.issuesByNumber)[0];
        const issueObject = jsonGraphArg.issuesByNumber[issueNumber];
        db.updateIssueData(jsonGraphArg).then((flag) => {
          if (flag !== true) {
            throw new Error("Error while updating issue data");
          }
          resolve([{
            path: ['issuesByNumber', parseInt(issueNumber), 'published_at'],
            value: issueObject.published_at,
          }, {
            path: ['latestIssue'],
            invalidated: true,
          }]);
        })
      });
    },
  },
  {
    route: "issuesByNumber['updateIssueArticles']",
    call: (callPath, args) => {
      return new Promise((resolve) => {
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
          if (toAdd.hasOwnProperty("featured")) {
            results.push(toAdd.featured);
          }
          if (toAdd.hasOwnProperty("picks")) {
            results = results.concat(toAdd.picks);
          }
          if (toAdd.hasOwnProperty("categories")) {
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
        })
      })
    },
  },
  {
    route: "issuesByNumber[{integers:issueNumbers}]['updateIssueCategories']",
    call: (callPath, args) => {
      return new Promise((resolve) => {
        const issueNumber = callPath.issueNumbers[0];
        const idArray = args[0];
        db.updateIssueCategories(issueNumber, idArray).then((flag) => {
          if (flag !== true) {
            throw new Error("updateIssueCategories returned non-true flag");
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
        })
      })
    },
  },
  {
    route: "issuesByNumber[{integers:issueNumbers}]['publishIssue']",
    call: (callPath, args) => {
      return new Promise((resolve) => {
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
      });
    },
  },
  {
    route: "issuesByNumber['addIssue']",
    call: (callPath, args) => {
      return new Promise((resolve) => {
        const issue = args[0];
        const fields = Object.keys(issue);
        db.addIssue(issue).then((flag) => {
          if (flag !== true) {
            throw new Error("For some reason addIssue db function returned a non-true flag");
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
      });
    },
  },
  {
    // Get trending articles
    // THIS IS TEMPORARY
    route: "trending[{integers:indices}]",
    get: (pathSet) => {
      return new Promise((resolve) => {
        // This function will at the moment only return 10 trending articles
        // so you cannot request anything above index 9
        db.trendingQuery().then((data) => {
          const results = [];
          pathSet.indices.forEach((index) => {
            if (index < data.length) {
              results.push({
                path: ['trending', index],
                value: $ref(['articlesBySlug', data[index].slug]),
              });
            }
          });
          resolve(results);
        });
      });
    },
  },
  {
    // Get total amount of articles
    route: "totalAmountOfArticles",
    get: () => {
      return new Promise((resolve) => {
        ghostArticleQuery("limit=1&fields=slug").then((data) => {
          resolve([{
            path: ['totalAmountOfArticles'],
            value: data.meta.pagination.total,
          }]);
        })
      })
    },
  },
  {
    // Get latest issue
    route: "latestIssue",
    get: () => {
      return new Promise((resolve) => {
        db.latestIssueQuery().then((row) => {
          resolve([{
            path: ['latestIssue'],
            value: $ref(['issuesByNumber', row[0].issue_order]),
          }]);
        })
      })
    },
  },
  {
    // Search for posts
    route: "search['posts'][{keys:queries}][{integers:indices}]",
    get: (pathSet) => {
      return new Promise((resolve) => {
        let minIndex = pathSet.indices[0];
        let maxIndex = pathSet.indices[0];
        pathSet.indices.forEach((index) => {
          if (index < minIndex) {
            minIndex = index;
          }
          if (index > maxIndex) {
            maxIndex = index;
          }
        });
        db.searchPostsQuery(pathSet.queries, minIndex, maxIndex).then((data) => {
          // Map all the indices down to fit the indices returned by the db call
          pathSet.indices = pathSet.indices.map((index) => {return index-minIndex});
          const results = [];
          _.forEach(data, (queryResults, query) => {
            pathSet.indices.forEach((index) => {
              if (index < queryResults.length) {
                results.push({
                  path: ['search', 'posts', query, index],
                  value: $ref(['articlesBySlug', queryResults[index]]),
                });
              }
            });
          });
          resolve(results);
        });
      });
    },
  },
  {
    // Search for authors by name
    route: "search['authors'][{keys:queries}][{integers:indices}]",
    get: (pathSet) => {
      return new Promise((resolve) => {
        let minIndex = pathSet.indices[0];
        let maxIndex = pathSet.indices[0];
        pathSet.indices.forEach((index) => {
          if (index < minIndex) {
            minIndex = index;
          }
          if (index > maxIndex) {
            maxIndex = index;
          }
        });
        db.searchAuthorsQuery(pathSet.queries, minIndex, maxIndex).then((data) => {
          // Map all the indices down to fit the indices returned by the db call
          pathSet.indices = pathSet.indices.map((index) => {return index-minIndex});
          const results = [];
          _.forEach(data, (queryResults, query) => {
            pathSet.indices.forEach((index) => {
              if (index < queryResults.length) {
                results.push({
                  path: ['search', 'authors', query, index],
                  value: $ref(['authorsBySlug', queryResults[index]]),
                });
              }
            });
          });
          resolve(results);
        });
      });
    },
  },
  {
    route: "search['teams'][{keys:queries}][{integers:indices}]",
    get: (pathSet) => {
      return new Promise((resolve) => {
        let minIndex = pathSet.indices[0];
        let maxIndex = pathSet.indices[0];
        pathSet.indices.forEach((index) => {
          if (index < minIndex) {
            minIndex = index;
          }
          if (index > maxIndex) {
            maxIndex = index;
          }
        });
        db.searchTeamsQuery(pathSet.queries, minIndex, maxIndex).then((data) => {
          // Map all the indices down to fit the indices returned by the db call
          pathSet.indices = pathSet.indices.map((index) => {return index-minIndex});
          const results = [];
          _.forEach(data, (queryResults, query) => {
            pathSet.indices.forEach((index) => {
              if (index < queryResults.length) {
                results.push({
                  path: ['search', 'teams', query, index],
                  value: $ref(['teamsBySlug', queryResults[index]]),
                });
              }
            });
          });
          resolve(results);
        });
      });
    },
  },
  {
    route: "teamsBySlug[{keys:slugs}]['slug', 'id', 'name', 'description']",
    get: (pathSet) => {
      return new Promise((resolve) => {
        const requestedFields = pathSet[2];
        db.teamQuery(pathSet.slugs, requestedFields).then((data) => {
          const results = [];
          data.forEach((team) => {
            requestedFields.forEach((field) => {
              results.push({
                path: ["teamsBySlug", team.slug, field],
                value: team[field],
              });
            });
          });
          resolve(results);
        });
      });
    },
    set: (jsonGraphArg) => {
      return new Promise((resolve, reject) => {
        const teamsBySlug = jsonGraphArg.teamsBySlug;
        db.updateTeams(teamsBySlug).then((flag) => {
          if (!flag) {
            throw new Error("For unknown reasons updateTeams returned a non-true flag");
          }
          const results = [];
          _.forEach(teamsBySlug, (teamObject, slug) => {
            _.forEach(teamObject, (value, field) => {
              results.push({
                path: ['teamsBySlug', slug, field],
                value: value,
              });
            });
          });
          resolve(results);
        })
        .catch((e) => {
          reject(e);
        });
      });
    },
  },
  {
    route: "teamsBySlug[{keys:slugs}]['authors'][{integers:indices}]",
    get: (pathSet) => {
      return new Promise((resolve) => {
        db.teamAuthorQuery(pathSet.slugs).then((data) => {
          const results = [];
          _.forEach(data, (authorSlugArray, teamSlug) => {
            pathSet.indices.forEach((index) => {
              if (index < authorSlugArray.length) {
                results.push({
                  path: ['teamsBySlug', teamSlug, 'authors', index],
                  value: $ref(['authorsBySlug', authorSlugArray[index]]),
                });
              }
            });
          });
          resolve(results);
        });
      });
    },
  },
  {
    route: "teamsBySlug['createTeam']",
    call: (callPath, args) => {
      return new Promise((resolve) => {
        const teamObject = args[0];
        if (!(teamObject.hasOwnProperty('slug') && teamObject.hasOwnProperty('name'))) {
          throw new Error("When creating an team you must provide both name and slug");
        }
        db.addTeam(teamObject).then((flag) => {
          if (!flag) {
            throw new Error("For unknown reasons addTeam returned a non-true flag");
          }
          const results = [];
          _.forEach(teamObject, (value, field) => {
            results.push({
              path: ['teamsBySlug', teamObject.slug, field],
              value: value,
            });
          });
          resolve(results);
        });
      });
    },
  },
  {
    route: "teamsByIndex[{integers:indices}]",
    get: (pathSet) => {
      return new Promise((resolve) => {
        db.teamArrayQuery().then((data) => {
          const results = [];
          pathSet.indices.forEach((index) => {
            if (index < data.length) {
              results.push({
                path: ['teamsByIndex', index],
                value: $ref(['teamsBySlug', data[index]]),
              });
            }
          });
          resolve(results);
        });
      });
    },
  },
  {
    // A placeholder so we can do empty calls that just invalidate
    route: "placeholder",
    get: () => {
      return [{
        path: ['placeholder'],
        value: "placeholder",
      }];
    },
  },
])
// Begin actual class methods below
{
  constructor() {
    super()
  }
}
