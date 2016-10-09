import knex from 'knex';
import databaseConfig from 'lib/../../config/database.config';
import { mapGhostNames } from 'lib/falcor/FalcorRouter';
import _ from 'lodash';
import { formatDate, formatDateTime } from 'lib/utilities';

const knexConnectionObject = {
  client: 'mysql',
  connection: databaseConfig,
};

const database = knex(knexConnectionObject);

export default class db {
  authorQuery(slugs, columns) {
    // parameters are both expected to be arrays
    // the first one with author slugs to fetch
    // and the other one the columns to retrieve from the authors
    return new Promise((resolve, reject) => {
      // const database = knex(knexConnectionObject);
      // So the Falcor Router knows which author we're talking about
      if (!columns.some((col) => {return col === "slug"})) {
        // Use concat to make a copy, if you just push
        // it will change pathSet in the falcorPath
        // as objects are passed by reference
        columns = columns.concat(['slug']);
      }
      database.select(...columns)
      .from('authors')
      .whereIn('slug', slugs)
      .then((rows) => {
        // database.destroy();
        resolve(rows);
      })
      .catch((e) => {
        // database.destroy();
        throw new Error(e);
      });
    });
  }

  authorArticleQuery(slugs) {
    // slugs function parameter is an array of author slugs
    // of which to fetch the articles they have written.
    // The function returns an object with author slugs
    // as keys and values being arrays of article slugs
    // sorted by most recent article first.
    return new Promise((resolve, reject) => {
      // const database = knex(knexConnectionObject);
      database.select('posts.slug as post_slug', 'authors.slug as author_slug')
      .from('authors')
      .innerJoin('authors_posts', 'authors.id', '=', 'author_id')
      .innerJoin('posts', 'posts.id', '=', 'post_id')
      .innerJoin('posts_meta', 'posts.id', '=', 'posts_meta.id')
      .whereNotNull('gazelle_published_at')
      .whereIn('authors.slug', slugs).orderBy('gazelle_published_at', 'desc')
      .then((rows) => {
        // rows is an array of objects with keys author_slug and post_slug
        const data = {};
        rows.forEach((row) => {
          // This will input them in chronological order as
          // the query was structured as so.
          if (!data.hasOwnProperty(row.author_slug)) {
            data[row.author_slug] = [row.post_slug];
          }
          else {
            data[row.author_slug].push(row.post_slug);
          }
        });
        // database.destroy();
        resolve(data);
      })
      .catch((e) => {
        // database.destroy();
        throw new Error(e);
      })
    })
  }

  infoPagesQuery(slugs, columns) {
    // parameters are both expected to be arrays
    // first one with page slugs to fetch
    // second one which columns to fetch from the db
    return new Promise((resolve, reject) => {
      // const database = knex(knexConnectionObject);
      // So the Falcor Router knows which author we're talking about
      if (columns.find((col) => {return col === "slug"}) === undefined) {
        // Use concat to make a copy, if you just push
        // it will change pathSet in the falcorPath
        // as objects are passed by reference
        columns = columns.concat(['slug']);
      }
      database.select(...columns)
      .from('info_pages')
      .whereIn('slug', slugs)
      .then((rows) => {
        // database.destroy();
        resolve(rows);
      })
      .catch((e) => {
        // database.destroy();
        throw new Error(e);
      })
    })
  }

  articleQuery(slugs, columns) {
    // parameters are both expected to be arrays
    // first one with article slugs to fetch
    // second one which columns to fetch from the posts_meta table
    return new Promise((resolve, reject) => {
      // const database = knex(knexConnectionObject);
      // we join with posts table to find slug, and always return slug
      columns = columns.map((col) => {
        // make it compatible for the sql query
        if (col === "category") {
          return "categories.slug as category";
        }
        else if (col === "published_at") {
          return "gazelle_published_at as published_at";
        }
        else {
          return col;
        }
      })
      // Put slug there so we know what we fetched
      // Use concat to make a copy, if you just push
      // it will change pathSet in the falcorPath
      // as objects are passed by reference
      columns = columns.concat(['posts.slug as slug']);
      database.select(...columns)
      .from('posts')
      .innerJoin('posts_meta', 'posts.id', '=', 'posts_meta.id')
      .innerJoin('categories', 'posts_meta.category_id', '=', 'categories.id')
      .whereIn('posts.slug', slugs)
      .then((rows) => {
        // database.destroy();
        resolve(rows);
      })
      .catch((e) => {
        // database.destroy();
        throw new Error(e);
      })
    })
  }

  articleIssueQuery(slugs) {
    // the parameter is the slugs the issueNumber is being requested from
    return new Promise((resolve, reject) => {
      // const database = knex(knexConnectionObject);
      database.select('issue_order as issueNumber', 'posts.slug as slug')
      .from('posts')
      .innerJoin('issues_posts_order', 'issues_posts_order.post_id', '=', 'posts.id')
      .innerJoin('issues', 'issues.id', '=', 'issues_posts_order.issue_id')
      .whereIn('posts.slug', slugs)
      .then((rows) => {
        // database.destroy();
        resolve(rows);
      })
      .catch((e) => {
        // database.destroy();
        throw new Error(e);
      })
    });
  }

  articleAuthorQuery(slugs) {
    // slugs function parameter is an array of article slugs
    // of which to fetch the authors of.
    // The function returns an object with article slugs
    // as keys and values being arrays of author slugs.
    return new Promise((resolve, reject) => {
      // const database = knex(knexConnectionObject);
      database.select('posts.slug as post_slug', 'authors.slug as author_slug')
      .from('authors')
      .innerJoin('authors_posts', 'authors.id', '=', 'author_id')
      .innerJoin('posts', 'posts.id', '=', 'post_id')
      .innerJoin('posts_meta', 'posts.id', '=', 'posts_meta.id')
      .whereIn('posts.slug', slugs)
      .orderBy('authors_posts.id', 'asc')
      .then((rows) => {
        // rows is an array of objects with keys author_slug and post_slug
        const data = {};
        rows.forEach((row) => {
          // This will input them in ascending order by id (which represents time they were
          // inserted as author of that article) as the query was structured so.
          if (!data.hasOwnProperty(row.post_slug)) {
            data[row.post_slug] = [row.author_slug];
          }
          else {
            data[row.post_slug].push(row.author_slug);
          }
        });
        // database.destroy();
        resolve(data);
      })
      .catch((e) => {
        // database.destroy();
        throw new Error(e);
      })
    })
  }

  latestIssueQuery() {
    // returns the newest issue number
    return new Promise((resolve, reject) => {
      // const database = knex(knexConnectionObject);
      database.select('issue_order')
      .from('issues')
      .orderBy('issue_order', 'desc')
      .whereNotNull('published_at').limit(1)
      .then((rows) => {
        // database.destroy();
        resolve(rows);
      })
      .catch((e) => {
        // database.destroy();
        throw new Error(e);
      })
    })
  }

  categoryQuery(slugs, columns) {
    // slugs parameter is an array of category slugs
    // to fetch the name of
    return new Promise((resolve, reject) => {
      // const database = knex(knexConnectionObject);
      if (columns.find((col) => {return col==="slug"}) === undefined) {
        // Copy so as to not change pathSet
        columns = columns.concat(['slug']);
      }
      database.select(...columns)
      .from('categories')
      .whereIn('slug', slugs)
      .then((rows) => {
        // database.destroy();
        resolve(rows);
      })
      .catch((e) => {
        // database.destroy();
        throw new Error(e);
      });
    });
  }

  categoryArrayQuery() {
    // fetch all the categories in the database and return
    // an array of slugs. It is important the order is deterministic though
    return new Promise((resolve, reject) => {
      database.select('slug')
      .from('categories')
      .orderBy('id', 'desc')
      .then((rows) => {
        const result = _.map(rows, (row) => {return row.slug});
        resolve(result);
      })
      .catch((e) => {
        throw new Error(e);
      })
    })
  }

  categoryArticleQuery(slugs) {
    // slugs parameter is an array of category slugs
    // of which to fetch the articles from
    // Will return object where keys are category slugs
    // and values are arrays of articles from newest to oldest
    return new Promise((resolve, reject) => {
      // const database = knex(knexConnectionObject);
      database.select('posts.slug as post_slug', 'categories.slug as cat_slug')
      .from('posts')
      .innerJoin('posts_meta', 'posts.id', '=', 'posts_meta.id')
      .innerJoin('categories', 'categories.id', '=', 'posts_meta.category_id')
      .whereIn('categories.slug', slugs)
      .whereNotNull('gazelle_published_at')
      .orderBy('gazelle_published_at', 'desc')
      .then((rows) => {
        // rows is an array of objects with keys post_slug and cat_slug
        const data = {};
        rows.forEach((row) => {
          // This will input them in chronological order as
          // the query was structured as so.
          if (!data.hasOwnProperty(row.cat_slug)) {
            data[row.cat_slug] = [row.post_slug];
          }
          else {
            data[row.cat_slug].push(row.post_slug);
          }
        });
        // database.destroy();
        resolve(data);
      })
      .catch((e) => {
        // database.destroy();
        throw new Error(e);
      })
    })
  }

  featuredArticleQuery(issueNumbers) {
    // Get the featured articles from all the issueNumbers
    return new Promise((resolve, reject) => {
      // const database = knex(knexConnectionObject);
      database.select('posts.slug', 'issue_order')
      .from('posts')
      .innerJoin('issues_posts_order', 'issues_posts_order.post_id', '=', 'posts.id')
      .innerJoin('issues', 'issues.id', '=', 'issues_posts_order.issue_id')
      .whereIn('issues.issue_order', issueNumbers).andWhere('type', '=', 1)
      .then((rows) => {
        // database.destroy();
        resolve(rows);
      })
      .catch((e) => {
        // database.destroy();
        throw new Error(e);
      })
    })
  }

  editorPickQuery(issueNumbers) {
    // Get the editor's picks from all the issueNumbers
    return new Promise((resolve, reject) => {
      // const database = knex(knexConnectionObject);
      database.select('posts.slug', 'issue_order')
      .from('posts')
      .innerJoin('issues_posts_order', 'issues_posts_order.post_id', '=', 'posts.id')
      .innerJoin('issues', 'issues.id', '=', 'issues_posts_order.issue_id')
      .whereIn('issues.issue_order', issueNumbers).andWhere('type', '=', 2)
      .then((rows) => {
        const results = {};
        rows.forEach((row) => {
          if (!results.hasOwnProperty(row.issue_order)) {
            results[row.issue_order] = [row.slug];
          }
          else {
            results[row.issue_order].push(row.slug);
          }
        });
        // database.destroy();
        resolve(results);
      })
      .catch((e) => {
        // database.destroy();
        throw new Error(e);
      })
    })
  }

  issueCategoryQuery(issueNumbers, fields) {
    // get the categories from each issueNumber
    return new Promise((resolve, reject) => {
      // const database = knex(knexConnectionObject);
      // rewrite the columns to proper format
      let columns = fields.map((col) => {
        switch(col) {
          case "slug":
            return "categories.slug";
          case "name":
            return "categories.name";
          case "id":
            return "categories.id";
          default:
            throw new Error("Unexpected field passed to dbIssueCategoryQuery");
        }
      });
      // Add issue_order as we need to know which issue the data belongs to
      columns.push('issue_order', 'categories_order');
      database.select(...columns)
      .from('issues')
      .innerJoin('issues_categories_order', 'issues_categories_order.issue_id', '=', 'issues.id')
      .innerJoin('categories', 'issues_categories_order.category_id', '=', 'categories.id')
      .whereIn('issues.issue_order', issueNumbers).orderBy('categories_order', 'asc')
      .then((rows) => {
        const results = {};
        rows.forEach((row) => {
          const issueNumber = row.issue_order;
          const categoryIndex = row.categories_order;
          const categoryObject = {};
          fields.forEach((field) => {
            categoryObject[field] = row[field];
          })
          if (!results.hasOwnProperty(issueNumber)) {
            results[issueNumber] = [];
          }
          if (results[issueNumber].length !== categoryIndex) {
            throw new Error("Incorrect data returned from database regarding getting category order. Either missing category or not ordered correctly in dbIssueCategoryQuery");
          }
          results[issueNumber].push(categoryObject);
        });
        // database.destroy();
        resolve(results);
      })
      .catch((e) => {
        // database.destroy();
        throw new Error(e);
      });
    });
  }

  issueCategoryArticleQuery(issueNumbers) {
    // get the categories from each issueNumber
    return new Promise((resolve, reject) => {
      // const database = knex(knexConnectionObject);
      database.select('issue_order', 'posts.slug', 'posts_order', 'posts_meta.category_id')
      .from('issues')
      .innerJoin('issues_posts_order', 'issues_posts_order.issue_id', '=', 'issues.id')
      .innerJoin('posts', 'posts.id', '=', 'issues_posts_order.post_id')
      .innerJoin('posts_meta', 'posts.id', '=', 'posts_meta.id')
      .whereIn('issues.issue_order', issueNumbers).andWhere('type', '=', 0).orderBy('posts_order', 'ASC')
      .then((postRows) => {
        database.select('issue_order', 'categories_order', 'issues_categories_order.category_id')
        .from('issues')
        .innerJoin('issues_categories_order', 'issues.id', '=', 'issues_categories_order.issue_id')
        .whereIn('issues.issue_order', issueNumbers).orderBy('categories_order', 'ASC')
        .then((categoryRows) => {
          const results = {};
          const categoriesHashMap = {};
          postRows.forEach((postRow) => {
            // I make a lot of assumptions about correctness of data returned here
            const issueNumber = postRow.issue_order;
            // Here I handle finding the corresponding category row and thereby the order
            // this category should be in, and also use hashing as we will be looking this up often.
            let categoryIndex;
            if (categoriesHashMap.hasOwnProperty(issueNumber) && categoriesHashMap[issueNumber].hasOwnProperty(postRow.category_id)) {
              categoryIndex = categoriesHashMap[issueNumber][postRow.category_id];
            }
            else {
              const correspondingCategoryRow = categoryRows.find((categoryRow) => {
                return categoryRow.issue_order === issueNumber && categoryRow.category_id === postRow.category_id;
              });
              if (correspondingCategoryRow === undefined) {
                throw new Error("can't find order of the category of a post");
              }
              if (!categoriesHashMap.hasOwnProperty[issueNumber]) {
                categoriesHashMap[issueNumber] = {};
              }
              // Since we did the previous check it must not also have the posts key
              if (categoriesHashMap[issueNumber].hasOwnProperty(postRow.category_id)) {
                throw new Error("Problem with if else statement in dbIssueCategoryArticleQuery");
              }
              categoryIndex = categoriesHashMap[issueNumber][postRow.category_id] = correspondingCategoryRow.categories_order;
            }
            // Continue with rest of constants
            const postIndex = postRow.posts_order;
            const postSlug = postRow.slug;
            if (!results.hasOwnProperty(issueNumber)) {
              results[issueNumber] = [];
            }
            if (!results[issueNumber].hasOwnProperty(categoryIndex)) {
              results[issueNumber][categoryIndex] = [];
            }
            if (results[issueNumber][categoryIndex].length !== postIndex) {
              throw new Error("Incorrect data returned from database regarding getting articles in an issue. Articles either not existing or not ordered correctly");
            }
            results[issueNumber][categoryIndex].push(postSlug);
          });
          // Check all categories are there and ordering is correct
          _.forEach(results, (categoryArray, issueNumber) => {
            for (let i = 0; i < categoryArray.length; i++) {
              if (!categoryArray.hasOwnProperty(i)) {
                throw new Error("Problem with category ordering data. Either wrong ordering or missing category at issue number " + issueNumber.toString() + " index " + i.toString());
              }
            }
          })
          // database.destroy();
          resolve(results);
        })
        .catch((e) => {
          // database.destroy();
          throw new Error(e);
        });
      })
      .catch((e) => {
        // database.destroy();
        throw new Error(e);
      });
    });
  }

  issueQuery(issueNumbers, columns) {
    return new Promise((resolve, reject) => {
      // const database = knex(knexConnectionObject);
      const hasIssueNumber = columns.find((col) => {col === "issue_order"}) !== undefined;
      if (!hasIssueNumber) {
        // use concat to do a copy instead of changing original pathSet
        // we push this so that we know which issue we are fetching data for
        columns = columns.concat(["issue_order"]);
      }
      database.select(...columns)
      .from('issues')
      .whereIn('issues.issue_order', issueNumbers)
      .then((rows) => {
        // database.destroy();
        resolve(rows);
      })
      .catch((e) => {
        // database.destroy();
        throw new Error(e);
      });
    });
  }

  // THIS IS TEMPORARY
  trendingQuery() {
    return new Promise((resolve, reject) => {
      database.select('slug')
      .from('posts')
      .innerJoin('posts_meta', 'posts_meta.id', '=', 'posts.id')
      .whereNotNull('gazelle_published_at')
      .orderBy('gazelle_published_at', 'desc')
      .limit(10)
      .then((rows) => {
        resolve(rows);
      })
      .catch((e) => {
        throw new Error(e);
      });
    });
  }

  // THIS IS TEMPORARY
  relatedArticleQuery(slugs) {
    return new Promise((resolve, reject) => {
      database.select('slug')
      .from('posts')
      .innerJoin('posts_meta', 'posts_meta.id', '=', 'posts.id')
      .whereNotNull('gazelle_published_at')
      .orderBy('gazelle_published_at', 'desc')
      .limit(3)
      .then((rows) => {
        const results = {};
        const relatedArticlesArray = rows.map((row) => {return row.slug});
        slugs.forEach((slug) => {
          results[slug] = relatedArticlesArray.slice();
        });
        resolve(results);
      })
      .catch((e) => {
        throw new Error(e);
      });
    })
  }

  searchAuthorsQuery(queries, min, max) {
    return new Promise((resolve, reject) => {
      let queriesReturned = 0;
      const results = {};
      queries.forEach((query) => {
        database.select('slug')
        .from('authors')
        .where('name', 'like', '%'+query+'%')
        .limit(max-min+1).offset(min)
        .then((rows) => {
          queriesReturned++;
          results[query] = _.map(rows, (row) => {return row.slug});
          if (queriesReturned >= queries.length) {
            resolve(results);
          }
        })
      })
    })
  }

  searchPostsQuery(queries, min, max) {
    return new Promise((resolve, reject) => {
      let queriesReturned = 0;
      const results = {};
      queries.forEach((query) => {
        database.select('slug')
        .from('posts')
        .leftJoin('posts_meta', 'posts.id', '=', 'posts_meta.id')
        .where('title', 'like', '%'+query+'%')
        .orderByRaw('ISNULL(gazelle_published_at) DESC, gazelle_published_at DESC')
        .limit(max-min+1).offset(min)
        .then((rows) => {
          queriesReturned++;
          results[query] = _.map(rows, (row) => {return row.slug});
          if (queriesReturned >= queries.length) {
            resolve(results);
          }
        });
      });
    });
  }

  updateAuthors(articleId, newAuthors) {
    return new Promise((resolve, reject) => {
      database('authors_posts').where('post_id', '=', articleId).del()
      .then(() => {
        const insertArray = _.map(newAuthors, (authorId) => {
          return {
            post_id: articleId,
            author_id: authorId,
          }
        });
        database('authors_posts').insert(insertArray).then(() => {
          database.select('slug')
          .from('authors_posts')
          .innerJoin('authors', 'authors.id', '=', 'authors_posts.author_id')
          .where('post_id', '=', articleId)
          .then((rows) => {
            resolve(rows.map((row) => {return row.slug}));
          });
        });
      });
    });
  }

  updateGhostFields(jsonGraphArg) {
    return new Promise((resolve, reject) => {
      const updatesCalled = Object.keys(jsonGraphArg).length;
      let updatesReturned = 0;
      _.forEach(jsonGraphArg, (article, slug) => {
        const acceptedFields = {
          image: true,
          teaser: true,
        }
        const updateObject = {};
        _.forEach(article, (value, field) => {
          if (!acceptedFields[field]) {
            throw new Error("updateGhostFields is only configured to update image or teaser, you cannot update", field);
          }
          else {
            updateObject[mapGhostNames(field)] = value;
          }
        });
        database('posts').where('slug', '=', slug).update(updateObject).then((data) => {
          if (data !== 1) {
            throw new Error("error updating ghost field of article with slug:", slug);
          }
          updatesReturned++;
          if (updatesReturned >= updatesCalled) {
            // Just resolving to show everything went as planned
            resolve(true)
          }
        });
      });
    });
  }

  updatePostMeta(jsonGraphArg) {
    return new Promise((resolve, reject) => {
      const updatesCalled = Object.keys(jsonGraphArg).length;
      let updatesReturned = 0;
      const categorySlugsToFind = [];
      _.forEach(jsonGraphArg, (article) => {
        Object.keys(article).forEach((field) => {
          if (field === "category") {
            categorySlugsToFind.push(article[field]);
          }
        });
      });
      database.select('id', 'slug')
      .from('categories')
      .whereIn('slug', categorySlugsToFind)
      .then((categoryRows) => {
        const articleSlugs = Object.keys(jsonGraphArg);
        database.select('id', 'slug')
        .from('posts')
        .whereIn('slug', articleSlugs)
        .then((articleRows) => {
          _.forEach(jsonGraphArg, (article, slug) => {
            const updateObject = {};
            _.forEach(article, (value, field) => {
              if (field === "category") {
                const category = categoryRows.find((row) => {
                  return row.slug === value;
                });
                if (!category) {
                  throw new Error("Can't find " + value + " as a category to add");
                }
                updateObject.category_id = category.id;
              }
              else if (field === "published_at") {
                updateObject.gazelle_published_at = value;
              }
              else {
                updateObject[field] = value;
              }
            });

            const articleObject = articleRows.find((row) => {
              return row.slug === slug;
            });
            if (!articleObject) {
              throw new Error("Can't find " + slug + "as an article to update");
            }

            // We default to insert, with a conditional statement to update
            // if that id already exists to handle the case where we haven't yet
            // created a meta data row for that post
            const insertObject = Object.assign({}, updateObject, {id: articleObject.id});
            const insertQuery = database('posts_meta').insert(insertObject).toString();
            // Using a fixed array of keys to make sure we have the same order every time
            const fields = Object.keys(updateObject);
            let rawUpdateQuery = '';
            fields.forEach((field) => {
              rawUpdateQuery += ' ' + field + ' = :' + field;
            });
            const query = insertQuery + ' ON DUPLICATE KEY UPDATE' + database.raw(rawUpdateQuery, updateObject);

            database.raw(query)
            .then((data) => {
              if (data.length < 1 || data[0].constructor.name !== "OkPacket") {
                throw new Error("Problems updating meta data of article: " + slug);
              }
              updatesReturned++;
              if (updatesReturned >= updatesCalled) {
                resolve(true);
              }
            })
          });
        });
      });
    });
  }

  updateMainAuthorData(jsonGraphArg) {
    return new Promise((resolve, reject) => {
      const updatesCalled = Object.keys(jsonGraphArg).length;
      let updatesReturned = 0;
      _.forEach(jsonGraphArg, (authorObject, slug) => {
        database('authors').where('slug', '=', slug)
        .update(authorObject)
        .then((data) => {
          if (data !== 1) {
            throw new Error("Problems updating main author data of: " + slug);
          }
          updatesReturned++;
          if (updatesReturned >= updatesCalled) {
            resolve(true);
          }
        })
        .catch((e) => {
          reject(e);
        });
      });
    });
  }

  createAuthor(authorObject) {
    return new Promise((resolve, reject) => {
      database('authors').insert(authorObject)
      .then((data) => {
        // Insert statements should throw errors themselves
        // if they fail
        resolve(true);
      });
    });
  }

  updateIssueArticles(issueNumber, featuredArticles, picks, mainArticles) {
    // First we reset all issue, article, category relationships
    // This is simply to make our job easier, and update statements
    // don't have to be exceedingly efficient either as they are called
    // very rarely, and the user expects a wait time on saving changes
    return new Promise((resolve, reject) => {
      database.select('id', 'published_at')
      .from('issues')
      .where('issue_order', '=', issueNumber)
      .then((issues) => {
        if (issues.length !== 1) {
          throw new Error("issue_order should be unique");
        }
        const issueId = issues[0].id;
        const issuePublished = issues[0].published_at instanceof Date;
        database('issues_posts_order')
        .where('issue_id', '=', issueId)
        .del()
        .then(() => {
          database('issues_categories_order')
          .where('issue_id', '=', issueId)
          .del()
          .then(() => {
            // Now we can start inserting from scratch
            const articlesInsert = [];
            featuredArticles.forEach((article, index) => {
              articlesInsert.push({
                issue_id: issueId,
                type: 1,
                post_id: article.id,
                posts_order: index,
              });
            });

            picks.forEach((article, index) => {
              articlesInsert.push({
                issue_id: issueId,
                type: 2,
                post_id: article.id,
                posts_order: index,
              });
            });

            // We sort them by category so we can keep track of
            // the order within each category
            mainArticles.sort((a, b) => {
              a = a.category;
              b = b.category;
              if (!a || !b) {
                throw new Error("all articles should have a category" +
                  " when being inserted into an issue");
              }
              if (a > b) {
                return 1;
              }
              else if (a === b) {
                return 0;
              }
              else {
                return -1;
              }
            });

            let order = 0;
            mainArticles.forEach((article, index) => {
              if (index > 0) {
                if (mainArticles[index].category !== mainArticles[index-1].category) {
                  order = 0;
                }
              }
              articlesInsert.push({
                issue_id: issueId,
                type: 0,
                post_id: article.id,
                posts_order: order,
              });
              order++;
            });

            database('issues_posts_order').insert(articlesInsert)
            .then(() => {
              // Insert statements throw their own errors if there are problems
              const categoriesInsert = [];
              // Get a list of all the categories
              const seen = {};
              mainArticles.forEach((article) => {
                const category = article.category;
                if (!seen[category]) {
                  seen[category] = true;
                }
              });
              const categories = Object.keys(seen);
              // Get the id's of the categories
              database.select('id', 'slug', 'name')
              .from('categories')
              .whereIn('slug', categories)
              .then((rows) => {
                const slugToObject = {};
                rows.forEach((row) => {
                  slugToObject[row.slug] = row;
                });
                categories.forEach((category, index) => {
                  categoriesInsert.push({
                    issue_id: issueId,
                    category_id: slugToObject[category].id,
                    categories_order: index,
                  });
                });
                database('issues_categories_order')
                .insert(categoriesInsert)
                .then(() => {
                  // Insert statements throw their own errors
                  // Build results to return
                  const results = {
                    data: {},
                    invalidated: [
                      {
                        path: ['issuesByNumber', issueNumber, 'categories'],
                        invalidated: true,
                      },
                      {
                        path: ['issuesByNumber', issueNumber, 'featured'],
                        invalidated: true,
                      },
                      {
                        path: ['issuesByNumber', issueNumber, 'picks'],
                        invalidated: true,
                      },
                    ],
                  };

                  // For now until we change some things we'll only support
                  // one featured article, it will be easy to just change the
                  // falcor path quickly later though, which we should do

                  // All the orders came from the way the arrays were already
                  // ordered so we can just do the same order and it will be
                  // correct
                  const data = results.data;
                  featuredArticles.forEach((article, index) => {
                    if (index === 0) {
                      // Create the key and also only insert this one
                      data.featured = {
                        path: ['issuesByNumber', issueNumber, 'featured'],
                        value: {$type: "ref", value: ['articlesBySlug', article.slug]},
                      };
                    }
                  });

                  picks.forEach((article, index) => {
                    if (index === 0) {
                      // Only create the key if picks is non-empty
                      data.picks = [];
                    }
                    data.picks.push({
                      path: ['issuesByNumber', issueNumber, 'picks', index],
                      value: {$type: "ref", value: ['articlesBySlug', article.slug]}
                    });
                  });

                  let order = 0;
                  // add order to the category objects
                  categories.forEach((category, index) => {
                    slugToObject[category].index = index;
                  })
                  mainArticles.forEach((article, index) => {
                    if (index === 0) {
                      // initialize it since mainArticles was non-empty
                      const category = slugToObject[article.category];
                      data.categories = {
                        [category.index]: {
                          name: category.name,
                          slug: category.slug,
                          articles: [{
                            path: ['issuesByNumber', issueNumber, 'categories', category.index, 'articles', order],
                            value: {$type: "ref", value: ['articlesBySlug', article.slug]}
                          }],
                        }
                      };
                    }
                    // index > 0
                    else if (mainArticles[index].category !== mainArticles[index-1].category) {
                      // It's a new category
                      order = 0;
                      const category = slugToObject[article.category];
                      data.categories[category.index] = {
                        name: category.name,
                        slug: category.slug,
                        articles: [{
                          path: ['issuesByNumber', issueNumber, 'categories', category.index, 'articles', order],
                          value: {$type: "ref", value: ['articlesBySlug', article.slug]}
                        }],
                      };
                    }
                    else {
                      // We're just adding to the old category
                      const category = slugToObject[article.category];
                      data.categories[category.index].articles.push({
                        path: ['issuesByNumber', issueNumber, 'categories', category.index, 'articles', order],
                        value: {$type: "ref", value: ['articlesBySlug', article.slug]}
                      });
                    }
                    // Increment the order
                    order++;
                  });
                  // If the issue is already published we want to publish
                  // the articles that are being added to the issue as well
                  if (issuePublished) {
                    const allArticles = mainArticles.concat(picks, featuredArticles);
                    data.published = [];
                    const date = new Date();
                    const toPublish = allArticles.filter((article) => {
                      if (!article.published_at) {
                        data.published.push({
                          path: ['articlesBySlug', article.slug, 'published_at'],
                          value: date.getTime(),
                        });
                        return true;
                      }
                      return false;
                    }).map((article) => {
                      return article.id;
                    });
                    database('posts_meta').whereIn('id', toPublish)
                    .update('gazelle_published_at', formatDateTime(date))
                    .then(() => {
                      resolve(results);
                    });
                  }
                  else {
                    // Otherwise we simply resolve the results
                    resolve(results);
                  }
                });
              });
            });
          });
        });
      });
    });
  }

  updateIssueData(jsonGraphArg) {
    return new Promise((resolve, reject) => {
      const issueNumber = Object.keys(jsonGraphArg.issuesByNumber)[0];
      const value = jsonGraphArg.issuesByNumber[issueNumber].published_at;
      database('issues').where('issue_order', '=', issueNumber)
      .update('published_at', value).then((data) => {
        resolve(true);
      })
    })
  }

  publishIssue(issueId) {
    return new Promise((resolve, reject) => {
      // We first find all unpublished articles in the issue
      database.select('posts.id', 'slug', 'gazelle_published_at')
      .from('posts')
      .innerJoin('posts_meta', 'posts.id', '=', 'posts_meta.id')
      .innerJoin('issues_posts_order', 'posts.id', '=', 'issues_posts_order.post_id')
      .where('issue_id', '=', issueId)
      .then((articles) => {
        const dateObject = new Date();
        const results = {
          publishedArticles: [],
          date: dateObject,
        }
        // I could've used whereNull here to only get the filtered version
        // but I hope to catch other mistakes like if an invalid
        // date was input and the value was then 0000-00-00 00:00:00 it wouldn't
        // be caught otherwise
        const toPublish = [];
        articles.forEach((article) => {
          if (!(article.published_at instanceof Date)) {
            // This is not published
            toPublish.push(article.id);
            results.publishedArticles.push(article.slug)
          }
        });
        const currentTime = formatDateTime(dateObject);
        database('posts_meta')
        .whereIn('id', toPublish)
        .update({gazelle_published_at: currentTime})
        .then(() => {
          // Now we can publish the issue
          const currentDate = formatDate(dateObject);
          database('issues')
          .where('id', '=', issueId)
          .update({published_at: currentDate})
          .then(() => {
            resolve(results);
          })
        })
      })
    })
  }

  addIssue(issueObject) {
    return new Promise((resolve, reject) => {
      const insertObject = {};
      _.forEach(issueObject, (value, key) => {
        insertObject[mapGhostNames(key)] = value;
      });
      database('issues').insert(insertObject).then(() => {
        resolve(true);
      })
    });
  }

  updateIssueCategories(issueNumber, idArray) {
    return new Promise((resolve, reject) => {
      // First delete old categories order and get issue id
      database.select('id')
      .from('issues')
      .where('issue_order', '=', issueNumber)
      .then((rows) => {
        if (!rows || !rows.length || !rows[0].id) {
          throw new Error("Invalid issue number passed to updateIssueCategories");
        }
        const issueId = rows[0].id;
        database('issues_categories_order')
        .where('issue_id', '=', issueId)
        .del().then(() => {
          // Insert the new categories
          const toInsert = idArray.map((id, index) => {
            return {
              category_id: id,
              issue_id: issueId,
              categories_order: index,
            };
          });
          database('issues_categories_order').insert(toInsert)
          .then(() => {
            // The easiest way for now to handle this is to just
            // invalidate all the data and then refetch it instead
            // of updating everything. Otherwise you would have
            // to implement all the updates here, which we might do
            // at a later time
            resolve(true);
          });
        });
      })
    })
  }
}
