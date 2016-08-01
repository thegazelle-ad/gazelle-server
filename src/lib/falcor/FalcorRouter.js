import BaseRouter from "falcor-router"
import { ghostArticleQuery } from 'lib/ghostAPI'
import { sqlArticleQuery, sqlAuthorQuery } from 'lib/sql'
import falcor from 'falcor'

const $ref = falcor.Model.ref; 

// FLAG TO CHECK IF YOU WANT TO ACCESS GHOST API AND DATABASES
// THIS IS JUST FOR DEVELOPMENT WHILE WE DON'T HAVE ACTUAL SERVERS SET UP
const USE_DATABASES = true; 

// Transform ghost API names into our names
const mapGhostNames = (name) => {
  switch(name) {
    case 'pubDate':
      return 'published_at';
    case 'body':
      return 'markdown';
    default:
      return name;
  }
};

export default class FalcorRouter extends BaseRouter.createClass([
  {
    route: "appName",
    get: () => {
      return [{
        path: ["appName"],
        value: "The Gazelle",
      }]
    },
  },
  {
    // Get author information from SQL database
    // TODO: write path for articles written by the author
    route: "authorsBySlug[{keys:slugs}]['name', 'photo', 'biography', 'slug']",
    get: (pathSet) => {
      return new Promise((resolve, reject) => {
        if (!USE_DATABASES) {
          resolve([]);
          return null;
        }
        const query = {slug: {$in: pathSet.slugs}};
        const length = pathSet.slugs.length;
        const projection = {_id: 0};
        pathSet[2].forEach((field) => {
          projection[field] = 1;
        });
        sqlAuthorQuery(query, projection).then((data) => {
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
    // Get article data from Ghost API
    route: "articlesBySlug[{keys:slugs}]['pubDate', 'id', 'image', 'slug', 'title', 'body', 'html']",
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
    //Get custom article data from SQL database
    route: "articlesBySlug[{keys:slugs}]['issue', 'category', 'description']",
    get: (pathSet) => {
      return new Promise((resolve, reject) => {
        if (!USE_DATABASES) {
          resolve([]);
          return null;
        }
        const query = {slug: {$in: pathSet.slugs}};
        const projection = {_id: 0};
        pathSet[2].forEach((field) => {
          projection[field] = 1;
        });
        projection['slug'] = 1;
        sqlArticleQuery(query, projection).then((data) => {
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
    // Get author information from article
    route: "articlesBySlug[{keys:slugs}]['authors'][{integers:indices}]",
    get: (pathSet) => {
      return new Promise((resolve, reject) => {
        if (!USE_DATABASES) {
          resolve([]);
          return null;
        }
        const query = {slug: {$in: pathSet.slugs}};
        const projection = {_id: 0, slug: 1, authors: 1};
        sqlArticleQuery(query, projection).then((data) => {
          const results = [];
          data.forEach((article) => {
            const authors = article.authors;
            pathSet.indices.forEach((index) => {
              if (index < authors.length) {
                results.push({
                  path: ['articlesBySlug', article.slug, 'authors', index],
                  value: $ref(['authorsBySlug', authors[index]])
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
    /* TODO: Figure out error handling.
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
      // TODO: Change it to fetch proper data when we can
      // TODO: Also in general implement falcor routes for everything about issues
      // Make issue a complete object with creation date, refs to articles etc.
      return [{
        path: ['latestIssue'],
        value: 50
      }];
    }
  }
])
// Begin actual class methods below
{
  constructor() {
    super()
  }
}
