import knex from 'knex';
import { getDatabaseConfig } from 'lib/utilities';

const config = getDatabaseConfig();
const knexConnectionObject = {
  client: 'mysql',
  connection: config,
  pool: {
    min: 0,
    max: 100
  }
};

export function dbAuthorQuery(slugs, columns) {
  // parameters are both expected to be arrays
  // the first one with author slugs to fetch
  // and the other one the columns to retrieve from the authors
  return new Promise((resolve, reject) => {
    const database = knex(knexConnectionObject);
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
      database.destroy();
      resolve(rows);
    })
    .catch((e) => {
      console.log("error");
      database.destroy();
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
    const database = knex(knexConnectionObject);
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
      database.destroy();
      resolve(data);
    })
    .catch((e) => {
      database.destroy();
      throw new Error(e);
    })
  })
}

export function dbInfoPagesQuery(slugs, columns) {
  // parameters are both expected to be arrays
  // first one with page slugs to fetch
  // second one which columns to fetch from the db
  return new Promise((resolve, reject) => {
    const database = knex(knexConnectionObject);
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
      database.destroy();
      resolve(rows);
    })
    .catch((e) => {
      database.destroy();
      throw new Error(e);
    })
  })
}

export function dbArticleQuery(slugs, columns) {
  // parameters are both expected to be arrays
  // first one with article slugs to fetch
  // second one which columns to fetch from the posts_meta table
  return new Promise((resolve, reject) => {
    const database = knex(knexConnectionObject);
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
      database.destroy();
      resolve(rows);
    })
    .catch((e) => {
      database.destroy();
      throw new Error(e);
    })
  })
}

export function dbArticleIssueQuery(slugs) {
  // the parameter is the slugs the issueNumber is being requested from
  return new Promise((resolve, reject) => {
    const database = knex(knexConnectionObject);
    database.select('issue_order as issueNumber', 'posts.slug as slug')
    .from('posts')
    .innerJoin('issues_posts_order', 'issues_posts_order.post_id', '=', 'posts.id')
    .innerJoin('issues', 'issues.id', '=', 'issues_posts_order.issue_id')
    .whereIn('posts.slug', slugs)
    .then((rows) => {
      database.destroy();
      resolve(rows);
    })
    .catch((e) => {
      database.destroy();
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
    const database = knex(knexConnectionObject);
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
      database.destroy();
      resolve(data);
    })
    .catch((e) => {
      database.destroy();
      throw new Error(e);
    })
  })
}

export function dbLatestIssueQuery() {
  // returns the newest issue number
  return new Promise((resolve, reject) => {
    const database = knex(knexConnectionObject);
    database.select('issue_order')
    .from('issues')
    .orderBy('issue_order', 'desc').limit(1)
    .then((rows) => {
      database.destroy();
      resolve(rows);
    })
    .catch((e) => {
      database.destroy();
      throw new Error(e);
    })
  })
}

export function dbCategoryQuery(slugs, columns) {
  // slugs parameter is an array of category slugs
  // to fetch the name of
  return new Promise((resolve, reject) => {
    const database = knex(knexConnectionObject);
    if (columns.find((col) => {return col==="slug"}) === undefined) {
      // Copy so as to not change pathSet
      columns = columns.concat(['slug']);
    }
    database.select(...columns)
    .from('categories')
    .whereIn('slug', slugs)
    .then((rows) => {
      database.destroy();
      resolve(rows);
    })
    .catch((e) => {
      database.destroy();
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
    const database = knex(knexConnectionObject);
    database.select('posts.slug as post_slug', 'categories.slug as cat_slug')
    .from('posts')
    .innerJoin('posts_meta', 'posts.id', '=', 'posts_meta.id')
    .innerJoin('categories', 'categories.id', '=', 'posts_meta.category_id')
    .whereIn('categories.slug', slugs).orderBy('gazelle_published_at', 'desc')
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
      database.destroy();
      resolve(data);
    })
    .catch((e) => {
      database.destroy();
      throw new Error(e);
    })
  })
}

export function dbFeaturedArticleQuery(issueNumbers) {
  // Get the featured articles from all the issueNumbers
  return new Promise((resolve, reject) => {
    const database = knex(knexConnectionObject);
    database.select('posts.slug', 'issue_order')
    .from('posts')
    .innerJoin('issues_posts_order', 'issues_posts_order.post_id', '=', 'posts.id')
    .innerJoin('issues', 'issues.id', '=', 'issues_posts_order.issue_id')
    .whereIn('issues.issue_order', issueNumbers).andWhere('type', '=', 1)
    .then((rows) => {
      database.destroy();
      resolve(rows);
    })
    .catch((e) => {
      database.destroy();
      console.error(e);
      throw new Error(e);
    })
  })
}

export function dbEditorPickQuery(issueNumbers) {
  // Get the editor's picks from all the issueNumbers
  return new Promise((resolve, reject) => {
    const database = knex(knexConnectionObject);
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
      resolve(results);
    })
    .catch((e) => {
      database.destroy();
      throw new Error(e);
    })
  })
}

export function dbIssueCategoryQuery(issueNumbers) {
  // get the categories from each issueNumber
  return new Promise((resolve, reject) => {
    const database = knex(knexConnectionObject);
    database.select('categories.slug', 'issue_order')
    .from('issues')
    .innerJoin('issues_categories_order', 'issues_categories_order.issue_id', '=', 'issues.id')
    .innerJoin('categories', 'issues_categories_order.category_id', '=', 'categories.id')
    .whereIn('issues.issue_order', issueNumbers).orderBy('categories_order', 'asc')
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
      resolve(results);
    })
    .catch((e) => {
      database.destroy();
      throw new Error(e);
    });
  });
}

export function dbIssueQuery(issueNumbers, columns) {
  return new Promise((resolve, reject) => {
    const database = knex(knexConnectionObject);
    // Use concat to make a copy, if you just push
    // it will change pathSet in the falcorPath
    // as objects are passed by reference
    columns = columns.concat(['issue_order']);
    database.select(...columns)
    .from('issues')
    .whereIn('issues.issue_order', issueNumbers)
    .then((rows) => {
      database.destroy();
      resolve(rows);
    })
    .catch((e) => {
      database.destroy();
      throw new Error(e);
    })
  })
}
