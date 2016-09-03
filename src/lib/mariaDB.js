import knex from 'knex';
import { getDatabaseConfig } from 'lib/utilities';

const config = getDatabaseConfig();
const knexConnectionObject = {
  client: 'mysql',
  connection: config,
};

export function dbAuthorQuery(slugs, columns) {
  // parameters are both expected to be arrays
  // the first one with author slugs to fetch
  // and the other one the columns to retrieve from the authors
  return new Promise((resolve, reject) => {
    const database = knex(knexConnectionObject);
    // So the Falcor Router knows which author we're talking about
    if (columns.find('slug') === undefined) {
      columns.push('slug');
    }
    database.select(...columns)
    .from('authors')
    .whereIn('slug', slugs)
    .then((rows) => {
      database.destroy();
      resolve(rows);
    })
    .catch((e) => {
      database.destroy();
      reject(e);
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
    database.select('posts.slug as post_slug', 'authors.slug author_slug')
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
      reject(e);
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
    if (columns.find('slug') === undefined) {
      columns.push('slug');
    }
    database.select(...columns)
    .from('info_pages')
    .then((rows) => {
      database.destroy();
      resolve(rows);
    })
    .catch((e) => {
      database.destroy();
      reject(e);
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
    columns.map((col) => {
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
    columns.push("posts.slug as slug");
    database.select(...columns)
    .from('posts')
    .innerJoin('posts_meta', 'posts.id', '=', 'posts_meta.id')
    .innerJoin('categories', 'posts_meta.category_id', '=', 'categories.id')
    .whereIn('posts.slug', 'slugs')
    .then((rows) => {
      database.destroy();
      resolve(rows);
    })
    .catch((e) => {
      database.destroy();
      reject(e);
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
      reject(e);
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
    database.select('posts.slug as post_slug', 'authors.slug author_slug')
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
      reject(e);
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
      reject(e);
    })
  })
}

export function dbCategoryNameQuery(slugs) {
  // slugs parameter is an array of category slugs
  // to fetch the name of
  return new Promise((resolve, reject) => {
    const database = knex(knexConnectionObject);
    database.select('slug', 'name')
    .from('categories')
    .whereIn('slug', slugs)
    .then((rows) => {
      database.destroy();
      resolve(rows);
    })
    .catch((e) => {
      database.destroy();
      reject(e);
    });
  });
}

export function dbCategoryArticleQuery(slugs) {
  // slugs parameter is an array of category slugs
  // of which to fetch the articles from
}
