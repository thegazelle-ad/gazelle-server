import knex from 'knex';
import databaseConfig from 'lib/../../database.config';
import _ from 'lodash';

const knexConnectionObject = {
  client: 'mysql',
  connection: databaseConfig,
};

const database = knex(knexConnectionObject);

export function dbAuthorQuery(slugs, columns) {
  // parameters are both expected to be arrays
  // the first one with author slugs to fetch
  // and the other one the columns to retrieve from the authors
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
    .from('authors')
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

export function dbAuthorArticleQuery(slugs) {
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

export function dbInfoPagesQuery(slugs, columns) {
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

export function dbArticleQuery(slugs, columns) {
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

export function dbArticleIssueQuery(slugs) {
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

export function dbArticleAuthorQuery(slugs) {
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
    .then((rows) => {
      // rows is an array of objects with keys author_slug and post_slug
      const data = {};
      rows.forEach((row) => {
        // This will input them in chronological order as
        // the query was structured as so.
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

export function dbLatestIssueQuery() {
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

export function dbCategoryQuery(slugs, columns) {
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

export function dbCategoryArticleQuery(slugs) {
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

export function dbFeaturedArticleQuery(issueNumbers) {
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
      console.error(e);
      throw new Error(e);
    })
  })
}

export function dbEditorPickQuery(issueNumbers) {
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

export function dbIssueCategoryQuery(issueNumbers, fields) {
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

export function dbIssueCategoryArticleQuery(issueNumbers) {
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

export function dbIssueQuery(issueNumbers, columns) {
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
export function dbTrendingQuery() {
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
export function dbRelatedArticleQuery(slugs) {
  return new Promise((resolve, reject) => {
    database.select('slug')
    .from('posts')
    .innerJoin('posts_meta', 'posts_meta.id', '=', 'posts.id')
    .whereNotNull('gazelle_published_at')
    .orderBy('gazelle_published_at', 'desc')
    .limit(3)
    .then((rows) => {
      console.log(rows);
      const results = {};
      const relatedArticlesArray = rows.map((row) => {return row.slug});
      console.log(relatedArticlesArray);
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
