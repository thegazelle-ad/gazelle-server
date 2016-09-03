import BaseRouter from "falcor-router"
import { ghostArticleQuery } from 'lib/ghostAPI'
import { dbAuthorQuery, dbArticleQuery, dbAuthorArticleQuery, dbInfoPagesQuery, dbArticleIssueQuery,
dbArticleAuthorQuery, dbLatestIssueQuery, dbCategoryNameQuery, dbCategoriesArticleQuery,
dbFeaturedArticleQuery, dbEditorPickQuery, dbIssueCategoryQuery, dbIssueQuery } from 'lib/mariaDB'
import falcor from 'falcor'
import _ from 'lodash';

const $ref = falcor.Model.ref;

let mapGhostNames = (falcorName) => {
  switch (falcorName) {
    case "teaser":
      return "meta_description";
    default:
      return falcorName;
  }
}

export default class FalcorRouter extends BaseRouter.createClass([
  {
    route: "infoPages[{keys:slugs}]['title', 'html', 'slug']",
    get: (pathSet) => {
      return new Promise((resolve, reject) => {
        dbInfoPagesQuery(pathSet.slugs, pathSet[2]).then((data) => {
          // data function parameter is an array of objects with keys equal to the columns requested.
          // Always returns the slug so we know which one we got
          const results = [];
          data.forEach((row) => {
            pathSet[2].forEach((key) => {
              if (!row.hasOwnProperty(key)) {
                throw new Error("missing data in infoPages, it is not even null, simply doesn't return");
              }
              else {
                results.push({
                  path: ['infoPages', row.slug, key],
                  value: row[key]
                });
              }
            });
          });
          resolve(results);
        });
      });
    }
  },
  {
    route: "authorsBySlug[{keys:slugs}]['name', 'image', 'biography', 'slug', 'job_title']",
    get: (pathSet) => {
      return new Promise((resolve, reject) => {
        dbAuthorQuery(pathSet.slugs, pathSet[2]).then((data) => {
          // always returns slug in the object no matter what.
          const results = [];
          data.forEach((author) => {
            pathSet[2].forEach((field) => {
              results.push({
                path: ["authorsBySlug", author.slug, field],
                value: author[field]
              });
            });
          });
          resolve(results);
        });
      });
    }
  },
  {
    // TODO: FINISH THIS
    route: "authorsBySlug[{keys:slugs}]['teams'][{integers:indices}]",
    get: (pathSet) => {
      return null;
    }
  },
  {
    route: "authorsBySlug[{keys:slugs}]['articles'][{integers:indices}]",
    // This could be a bit vulnerable as it fetches all articles written by an author
    // no matter what indices are called, but I think in reality it shouldn't be a problem
    get: (pathSet) => {
      return new Promise((resolve, reject) => {
        dbAuthorArticleQuery(pathSet.slugs).then((data) => {
          // We receive the data as an object with keys equalling author slugs
          // and values being an array of article slugs where the most recent is first
          const results = [];
          _.forEach(data, (postSlugArray, authorSlug) => {
            pathSet.indices.forEach((index) => {
              if (index < postSlugArray.length) {
                results.push({
                  path: ['authorsBySlug', authorSlug, 'articles', index],
                  value: $ref(['articlesBySlug', postSlugArray[index]])
                });
              }
            });
          });
          resolve(results);
        })
      });
    }
  },
  {
    // Get article data from Ghost API
    route: "articlesBySlug[{keys:slugs}]['id', 'image', 'slug', 'title', 'markdown', 'html', 'teaser']",
    get: (pathSet) => {
      return new Promise((resolve, reject ) => {
        let query = "filter=";
        pathSet.slugs.forEach((slug, index) => {
          query += (index > 0 ? "," : "") + "slug:" + "'" + slug + "'"; // Extra quotation marks are needed to avoid bug when slug starts with number
          // Remember to remove the extra quotation marks when the Ghost patch goes live.
        });
        query += "&fields=slug"
        pathSet[2].forEach((field, index) => {
          if (field !== 'slug') {
            query += "," + mapGhostNames(field);
          }
        })
        query += "&limit=" + pathSet.slugs.length.toString();
        ghostArticleQuery(query).then((data) => {
          data = data.posts;
          const results = [];
          data.forEach((article, index) => {
            pathSet[2].forEach((field) => {
              let ghostField = mapGhostNames(field);
              results.push({
                path: ["articlesBySlug", article.slug, field],
                value: article[ghostField]
              });
            });
          });
          resolve(results);
        });
      });
    }
  },
  {
    // Get custom article data from MariaDB
    route: "articlesBySlug[{keys:slugs}]['category', 'published_at', 'views']",
    get: (pathSet) => {
      return new Promise((resolve, reject) => {
        dbArticleQuery(pathSet.slugs, pathSet[2]).then((data) => {
          const results = [];
          data.forEach((article) => {
            pathSet[2].forEach((field) => {
              results.push({
                path: ["articlesBySlug", article.slug, field],
                value: article[field]
              });
            });
          });
          resolve(results);
        });
      });
    }
  },
  {
    // Get issueNumber from database
    route: "articlesBySlug[{keys:slugs}]['issueNumber']",
    get: (pathSet) => {
      return new Promise((resolve, reject) => {
        dbArticleIssueQuery(pathSet.slugs).then((data) => {
          const results = [];
          data.forEach((row) => {
            results.push({
              path: ["articlesBySlug", row.slug, 'issueNumber'],
              value: row.issueNumber
            });
          });
          resolve(results);
        })
      })
    }
  },
  {
    // Get author information from article
    route: "articlesBySlug[{keys:slugs}]['authors'][{integers:indices}]",
    get: (pathSet) => {
      return new Promise((resolve, reject) => {
        dbArticleAuthorQuery(pathSet.slugs).then((data) => {
          // We receive the data as an object with keys equalling article slugs
          // and values being an array of author slugs in no particular order
          const results = [];
          _.forEach(data, (authorSlugArray, postSlug) => {
            pathSet.indices.forEach((index) => {
              if (index < authorSlugArray.length) {
                results.push({
                  path: ['articlesBySlug', postSlug, 'authors', index],
                  value: $ref(['authorsBySlug', authorSlugArray[index]])
                });
              }
            });
          });
          resolve(results);
        })
      });
    }
  },
  {
    // Get related articles
    // THIS IS TEMPORARY
    route: "articlesBySlug[{keys:slugs}]['related'][{integers:indices}]",
    get: (pathSet) => {
      return new Promise((resolve, reject) => {
        ghostArticleQuery("limit=30&fields=slug").then((data) => {
          const results = [];
          data = data.posts;
          data = data.filter((post) => {
            return post.slug !== 'welcome-to-ghost';
          });
          pathSet.slugs.forEach((slug) => {
            pathSet.indices.forEach((index) => {
              results.push({
                path: ['articlesBySlug', slug, 'related', index],
                value: $ref(['articlesBySlug', data[index].slug])
              });
            });
          });
          resolve(results);
        });
      });
    }
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
      return new Promise((resolve, reject) => {
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
                    value: $ref(['articlesBySlug', articles[index].slug])
                  });
                }
              });
              queriesResolved++;
              if (queriesResolved === numberOfQueryCalls) {
                resolve(results);
              }
            }).catch((err) => {
              // figure out what you should actually do here
              console.error(err);
              reject(err);
            });
          });
        });
      });
    }
  },
  {
    // get categories name
    route: "categoriesBySlug[{keys:slugs}]['name']",
    get: (pathSet) => {
      return new Promise((resolve, reject) => {
        dbCategoryNameQuery(pathSet.slugs).then((data) => {
          const results = [];
          data.forEach((category) => {
            results.push({
              path: ['categoriesBySlug', category.slug, 'name'],
              value: category.name
            });
          });
          resolve(results);
        });
      });
    }
  },
  {
    // get articles in a category
    route: "categoriesBySlug[{keys:slugs}]['articles'][{integers:indices}]",
    get: (pathSet) => {
      return new Promise((resolve, reject) => {
        dbCategoriesArticleQuery(pathSet.slugs).then((data) => {
          // We receive the data as an object with keys equalling category slugs
          // and values being an array of article slugs where the most recent is first
          const results = [];
          _.forEach(data, (postSlugArray, categorySlug) => {
            pathSet.indices.forEach((index) => {
              if (index < postSlugArray.length) {
                results.push({
                  path: ['categoriesBySlug', categorySlug, 'articles', index],
                  value: $ref(['articlesBySlug', postSlugArray[index]])
                });
              }
            });
          });
          resolve(results);
        });
      });
    }
  },
  {
    // get featured article
    route: "issuesByNumber[{integers:issueNumbers}]['featured']",
    get: (pathSet) => {
      return new Promise((resolve, reject) => {
        dbFeaturedArticleQuery(pathSet.issueNumbers).then((data) => {
          const results = [];
          data.forEach((row) => {
            results.push({
              path: ['issuesByNumber', row.issue_order, 'featured'],
              value: $ref(['articlesBySlug', row.slug])
            });
          });
          resolve(results);
        });
      });
    }
  },
  {
    // get editor's picks
    route: "issuesByNumber[{integers:issueNumbers}]['picks'][{integers:indices}]",
    get: (pathSet) => {
      return new Promise((resolve, reject) => {
        dbEditorPickQuery(pathSet.issueNumbers).then((data) => {
          const results = [];
          _.forEach(data, (postSlugArray, issueNumber) => {
            pathSet.indices.forEach((index) => {
              if (index < postSlugArray.length) {
                results.push({
                  path: ['issuesByNumber', issueNumber, 'picks', index],
                  value: $ref(['articlesBySlug', postSlugArray[index]])
                });
              }
            });
          });
          resolve(results);
        });
      });
    }
  },
  {
    // Get articles within issue categories
    route: "issuesByNumber[{integers:issueNumbers}]['categories'][{integers:indices}]",
    get: (pathSet) => {
      console.log("issue categories");
      return new Promise((resolve, reject) => {
        dbIssueCategoryQuery(pathSet.issueNumbers).then((data) => {
          const results = [];
          _.forEach(data, (categorySlugArray, issueNumber) => {
            pathSet.indices.forEach((index) => {
              if (index < categorySlugArray.length) {
                results.push({
                  path: ['issuesByNumber', issueNumber, 'categories', index],
                  value: $ref(['categoriesBySlug', categorySlugArray[index]])
                });
              }
            });
          });
          console.log("resolving issue categories");
          resolve(results);
        })
      });
    }
  },
  {
    // Get issue data
    route: "issuesByNumber[{integers:issueNumbers}]['published_at', 'name']",
    get: (pathSet) => {
      console.log('data called');
      return new Promise((resolve, reject) => {
        dbIssueQuery(pathSet.issueNumbers, pathSet[2]).then((data) => {
          const results = [];
          data.forEach((issue) => {
            pathSet[2].forEach((field) => {
              results.push({
                path: ['issuesByNumber', issues.issue_order, field],
                value: issue[field]
              });
            });
          });
          console.log('data resolved');
          resolve(results);
        });
      });
    }
  },
  {
    // Get trending articles
    // THIS IS TEMPORARY
    route: "trending[{integers:indices}]",
    get: (pathSet) => {
      return new Promise((resolve, reject) => {
        ghostArticleQuery("limit=30&fields=slug").then((data) => {
          const results = [];
          data = data.posts;
          data = data.filter((post) => {
            return post.slug !== 'welcome-to-ghost';
          });
          pathSet.indices.forEach((index) => {
            results.push({
              path: ['trending', index],
              value: $ref(['articlesBySlug', data[index].slug])
            });
          });
          resolve(results);
        });
      });
    }
  },
  {
    // Get total amount of articles
    route: "totalAmountOfArticles",
    get: (pathSet) => {
      return new Promise((resolve, reject) => {
        ghostArticleQuery("limit=1&fields=slug").then((data) => {
          resolve([{
            path: ['totalAmountOfArticles'],
            value: data.meta.pagination.total
          }]);
        })
      })
    }
  },
  {
    // Get latest issue
    route: "latestIssue",
    get: (pathSet) => {
      return new Promise((resolve, reject) => {
        dbLatestIssueQuery().then((row) => {
          console.log(row[0].issue_order)
          resolve([{
            path: ['latestIssue'],
            value: $ref(['issuesByNumber', row[0].issue_order])
          }]);
        })
      })
    }
  },
])
// Begin actual class methods below
{
  constructor() {
    super()
  }
}
