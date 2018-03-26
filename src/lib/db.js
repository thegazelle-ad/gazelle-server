/* eslint-disable camelcase */
// We disable camelcase here due to SQL naming conventions
import knex from 'knex';
import stable from 'stable';
import knexConnectionObject from 'knexfile';
import _ from 'lodash';
import moment from 'moment';

const database = knex(knexConnectionObject);

export function authorQuery(slugs, columns) {
  // parameters are both expected to be arrays
  // the first one with author slugs to fetch
  // and the other one the columns to retrieve from the authors
  return new Promise((resolve) => {
    // So the Falcor Router knows which author we're talking about
    let processedColumns = columns;
    if (!processedColumns.some(col => col === 'slug')) {
      // Use concat to make a copy, if you just push
      // it will change pathSet in the falcorPath
      // as objects are passed by reference
      processedColumns = processedColumns.concat(['slug']);
    }
    database.select(...processedColumns)
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

export function authorTeamQuery(slugs) {
  // Arguments: `slugs`: array of author slugs
  // Returns: an object with author slugs (keys), each mapped
  // to an array of team slugs (values).
  return new Promise((resolve) => {
    database.select('teams.slug as teamSlug', 'authors.slug as authorSlug')
    .from('authors')
    .innerJoin('teams_authors', 'authors.id', '=', 'author_id')
    .innerJoin('teams', 'teams.id', '=', 'team_id')
    .whereIn('authors.slug', slugs)
    .then((rows) => {
      // `rows`: array of objects with keys `authorSlug` and `teamSlug`
      const data = {};
      rows.forEach((row) => {
        if (!data.hasOwnProperty(row.authorSlug)) {
          data[row.authorSlug] = [row.teamSlug];
        } else {
          data[row.authorSlug].push(row.teamSlug);
        }
      });
      resolve(data);
    })
    .catch((e) => {
      throw new Error(e);
    });
  });
}

export function authorArticleQuery(slugs) {
  // slugs function parameter is an array of author slugs
  // of which to fetch the articles they have written.
  // The function returns an object with author slugs
  // as keys and values being arrays of article slugs
  // sorted by most recent article first.
  return new Promise((resolve) => {
    database.select('articles.slug as articleSlug', 'authors.slug as authorSlug')
    .from('authors')
    .innerJoin('authors_posts', 'authors.id', '=', 'author_id')
    .innerJoin('articles', 'articles.id', '=', 'article_id')
    .whereNotNull('gazelle_published_at')
    .whereIn('authors.slug', slugs)
    .orderBy('gazelle_published_at', 'desc')
    .then((rows) => {
      // rows is an array of objects with keys authorSlug and articleSlug
      const data = {};
      rows.forEach((row) => {
        // This will input them in chronological order as
        // the query was structured as so.
        if (!data.hasOwnProperty(row.authorSlug)) {
          data[row.authorSlug] = [row.articleSlug];
        } else {
          data[row.authorSlug].push(row.articleSlug);
        }
      });
      // database.destroy();
      resolve(data);
    })
    .catch((e) => {
      // database.destroy();
      throw new Error(e);
    });
  });
}

export function infoPagesQuery(slugs, columns) {
  // parameters are both expected to be arrays
  // first one with page slugs to fetch
  // second one which columns to fetch from the db
  return new Promise((resolve) => {
    // So the Falcor Router knows which author we're talking about
    let processedColumns = columns;
    if (processedColumns.find(col => col === 'slug') === undefined) {
      // Use concat to make a copy, if you just push
      // it will change pathSet in the falcorPath
      // as objects are passed by reference
      processedColumns = processedColumns.concat(['slug']);
    }
    database.select(...processedColumns)
    .from('info_pages')
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

export function articleQuery(slugs, columns) {
  // parameters are both expected to be arrays
  // first one with article slugs to fetch
  // second one which columns to fetch from the articles table
  return new Promise((resolve) => {
    // we join with articles table to find slug, and always return slug
    let processedColumns = columns.map((col) => {
      // make it compatible for the sql query
      if (col === 'category') {
        return 'categories.slug as category';
      } if (col === 'published_at') {
        return 'gazelle_published_at as published_at';
      }
      return col;
    });
    // Put slug there so we know what we fetched
    // Use concat to make a copy, if you just push
    // it will change pathSet in the falcorPath
    // as objects are passed by reference
    processedColumns = processedColumns.concat(['articles.slug as slug']);
    database.select(...processedColumns)
    .from('articles')
    .innerJoin('categories', 'articles.category_id', '=', 'categories.id')
    .whereIn('articles.slug', slugs)
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

export function articleIssueQuery(slugs) {
  // the parameter is the slugs the issueNumber is being requested from
  return new Promise((resolve) => {
    database.select('issue_order as issueNumber', 'articles.slug as slug')
    .from('articles')
    .innerJoin('issues_posts_order', 'issues_posts_order.article_id', '=', 'articles.id')
    .innerJoin('issues', 'issues.id', '=', 'issues_posts_order.issue_id')
    .whereIn('articles.slug', slugs)
    .orderBy('articles.slug')
    .then((rows) => {
      // We always want to return the first issue the article was published in
      // and no more (currently we don't support falcor fetching all issues an
      // article was published in, if needed that's not a problem though)
      const toDelete = [];
      const lastRow = null;
      rows.forEach((row, index) => {
        if (lastRow && row.slug === lastRow.slug) {
          if (row.issueNumber < lastRow.issueNumber) {
            toDelete.push(index - 1);
          } else if (row.issueNumber > lastRow.issueNumber) {
            toDelete.push(index);
          } else {
            throw new Error(
`Data corrupted, article: ${row.slug} occurs twice in issue ${lastRow.issueNumber}`
            );
          }
        }
      });
      toDelete.reverse().forEach((index) => {
        rows.splice(index, 1);
      });
      resolve(rows);
    })
    .catch((e) => {
      throw new Error(e);
    });
  });
}

export function articleAuthorQuery(slugs) {
  // slugs function parameter is an array of article slugs
  // of which to fetch the authors of.
  // The function returns an object with article slugs
  // as keys and values being arrays of author slugs.
  return new Promise((resolve) => {
    database.select('articles.slug as articleSlug', 'authors.slug as authorSlug')
    .from('authors')
    .innerJoin('authors_posts', 'authors.id', '=', 'author_id')
    .innerJoin('articles', 'articles.id', '=', 'article_id')
    .whereIn('articles.slug', slugs)
    .orderBy('authors_posts.id', 'asc')
    .then((rows) => {
      // rows is an array of objects with keys authorSlug and articleSlug
      const data = {};
      rows.forEach((row) => {
        // This will input them in ascending order by id (which represents time they were
        // inserted as author of that article) as the query was structured so.
        if (!data.hasOwnProperty(row.articleSlug)) {
          data[row.articleSlug] = [row.authorSlug];
        } else {
          data[row.articleSlug].push(row.authorSlug);
        }
      });
      // database.destroy();
      resolve(data);
    })
    .catch((e) => {
      // database.destroy();
      throw new Error(e);
    });
  });
}

export function latestIssueQuery() {
  // returns the newest issue number
  return new Promise((resolve) => {
    database.select('issue_order')
    .from('issues')
    .orderBy('issue_order', 'desc')
    .whereNotNull('published_at')
    .limit(1)
    .then((rows) => {
      resolve(rows);
    })
    .catch((e) => {
      throw new Error(e);
    });
  });
}

export function interactiveArticleQuery(slugs, columns) {
  // Fetch information from interactive_meta
  return new Promise((resolve) => {
    const processedColumns = columns.map(col => `interactive_meta.${col}`);
    database.select('slug', ...processedColumns)
    .from('articles')
    .leftJoin('interactive_meta', 'interactive_meta.id', '=', 'articles.id')
    .whereIn('slug', slugs)
    .then(rows => resolve(rows))
    .catch((e) => { throw new Error(e); });
  });
}

export function categoryQuery(slugs, columns) {
  // slugs parameter is an array of category slugs
  // to fetch the name of
  return new Promise((resolve) => {
    let processedColumns = columns;
    if (processedColumns.find(col => col === 'slug') === undefined) {
      // Copy so as to not change pathSet
      processedColumns = processedColumns.concat(['slug']);
    }
    database.select(...processedColumns)
    .from('categories')
    .whereIn('slug', slugs)
    .then((rows) => {
      resolve(rows);
    })
    .catch((e) => {
      throw new Error(e);
    });
  });
}

export function categoryArrayQuery() {
  // fetch all the categories in the database and return
  // an array of slugs. It is important the order is deterministic though
  return new Promise((resolve) => {
    database.select('slug')
    .from('categories')
    .orderBy('id', 'desc')
    .then(rows => resolve(
      _.map(rows, row => row.slug)
    ))
    .catch((e) => {
      throw new Error(e);
    });
  });
}

export function categoryArticleQuery(slugs) {
  // slugs parameter is an array of category slugs
  // of which to fetch the articles from
  // Will return object where keys are category slugs
  // and values are arrays of articles from newest to oldest
  return new Promise((resolve) => {
    database.select('articles.slug as articleSlug', 'categories.slug as categorySlug')
    .from('articles')
    .innerJoin('categories', 'categories.id', '=', 'articles.category_id')
    .whereIn('categories.slug', slugs)
    .whereNotNull('gazelle_published_at')
    .orderBy('gazelle_published_at', 'desc')
    .then((rows) => {
      // rows is an array of objects with keys articleSlug and categorySlug
      const data = {};
      rows.forEach((row) => {
        // This will input them in chronological order as
        // the query was structured as so.
        if (!data.hasOwnProperty(row.categorySlug)) {
          data[row.categorySlug] = [row.articleSlug];
        } else {
          data[row.categorySlug].push(row.articleSlug);
        }
      });
      // database.destroy();
      resolve(data);
    })
    .catch((e) => {
      // database.destroy();
      throw new Error(e);
    });
  });
}

export function teamArrayQuery() {
  return new Promise((resolve) => {
    database.select('slug')
    .from('teams')
    .innerJoin('teams_authors', 'teams.id', '=', 'teams_authors.team_id')
    .orderBy('teams_authors.team_order', 'asc')
    .then((rows) => {
      // The SQL is returning a copy of the team for each author.
      const result = [];
      const resultSeen = {};
      rows.forEach((row) => {
        if (!resultSeen.hasOwnProperty(row.slug)) {
          result.push(row.slug);
          resultSeen[row.slug] = true;
        }
      });
      resolve(result);
    })
    .catch((e) => {
      throw new Error(e);
    });
  });
}

export function teamQuery(slugs, columns) {
  return new Promise((resolve) => {
    let processedColumns = columns;
    if (processedColumns.find(col => col === 'slug') === undefined) {
      processedColumns = processedColumns.concat(['slug']);
    }
    database.select(...processedColumns)
    .from('teams')
    .whereIn('slug', slugs)
    .then((rows) => {
      resolve(rows);
    })
    .catch((e) => {
      throw new Error(e);
    });
  });
}

export function teamAuthorQuery(slugs) {
  // Arguments: `slugs`: array of team slugs
  // Returns: an object with team slugs (keys), each mapped
  // to an array of author slugs (values).
  return new Promise((resolve) => {
    database.select('teams.slug as teamSlug', 'authors.slug as authorSlug')
    .from('authors')
    .innerJoin('teams_authors', 'authors.id', '=', 'author_id')
    .innerJoin('teams', 'teams.id', '=', 'teams_authors.team_id')
    .whereIn('teams.slug', slugs)
    .orderBy('teams_authors.author_order', 'asc')
    .then((rows) => {
      // `rows`: array of objects with keys `authorSlug` and `teamSlug`
      const data = {};
      rows.forEach((row) => {
        if (!data.hasOwnProperty(row.teamSlug)) {
          data[row.teamSlug] = [row.authorSlug];
        } else {
          data[row.teamSlug].push(row.authorSlug);
        }
      });
      resolve(data);
    })
    .catch((e) => {
      throw new Error(e);
    });
  });
}

export function featuredArticleQuery(issueNumbers) {
  // Get the featured articles from all the issueNumbers
  return new Promise((resolve) => {
    database.select('articles.slug', 'issue_order')
    .from('articles')
    .innerJoin('issues_posts_order', 'issues_posts_order.article_id', '=', 'articles.id')
    .innerJoin('issues', 'issues.id', '=', 'issues_posts_order.issue_id')
    .whereIn('issues.issue_order', issueNumbers)
    .andWhere('type', '=', 1)
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

export function editorPickQuery(issueNumbers) {
  // Get the editor's picks from all the issueNumbers
  return new Promise((resolve) => {
    database.select('articles.slug', 'issue_order')
    .from('articles')
    .innerJoin('issues_posts_order', 'issues_posts_order.article_id', '=', 'articles.id')
    .innerJoin('issues', 'issues.id', '=', 'issues_posts_order.issue_id')
    .whereIn('issues.issue_order', issueNumbers)
    .andWhere('type', '=', 2)
    .then((rows) => {
      const results = {};
      rows.forEach((row) => {
        if (!results.hasOwnProperty(row.issue_order)) {
          results[row.issue_order] = [row.slug];
        } else {
          results[row.issue_order].push(row.slug);
        }
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

export function issueCategoryQuery(issueNumbers, fields) {
  // get the categories from each issueNumber
  return new Promise((resolve) => {
    // rewrite the columns to proper format
    const columns = fields.map((col) => {
      switch (col) {
        case 'slug':
          return 'categories.slug';
        case 'name':
          return 'categories.name';
        case 'id':
          return 'categories.id';
        default:
          throw new Error('Unexpected field passed to dbIssueCategoryQuery');
      }
    });
    // Add issue_order as we need to know which issue the data belongs to
    columns.push('issue_order', 'categories_order');
    database.select(...columns)
    .from('issues')
    .innerJoin('issues_categories_order', 'issues_categories_order.issue_id', '=', 'issues.id')
    .innerJoin('categories', 'issues_categories_order.category_id', '=', 'categories.id')
    .whereIn('issues.issue_order', issueNumbers)
    .orderBy('categories_order', 'asc')
    .then((rows) => {
      const results = {};
      rows.forEach((row) => {
        const issueNumber = row.issue_order;
        const categoryIndex = row.categories_order;
        const categoryObject = {};
        fields.forEach((field) => {
          categoryObject[field] = row[field];
        });
        if (!results.hasOwnProperty(issueNumber)) {
          results[issueNumber] = [];
        }
        if (results[issueNumber].length !== categoryIndex) {
          throw new Error('Incorrect data returned from database regarding getting category ' +
'order. Either missing category or not ordered correctly in dbIssueCategoryQuery');
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

export function issueCategoryArticleQuery(issueNumbers) {
  // get the categories from each issueNumber
  return new Promise((resolve) => {
    database.select('issue_order', 'articles.slug', 'posts_order', 'articles.category_id')
    .from('issues')
    .innerJoin('issues_posts_order', 'issues_posts_order.issue_id', '=', 'issues.id')
    .innerJoin('articles', 'articles.id', '=', 'issues_posts_order.article_id')
    .whereIn('issues.issue_order', issueNumbers)
    .andWhere('type', '=', 0)
    .orderBy('posts_order', 'ASC')
    .then((articleRows) => {
      database.select('issue_order', 'categories_order', 'issues_categories_order.category_id')
      .from('issues')
      .innerJoin('issues_categories_order', 'issues.id', '=', 'issues_categories_order.issue_id')
      .whereIn('issues.issue_order', issueNumbers)
      .orderBy('categories_order', 'ASC')
      .then((categoryRows) => {
        const results = {};
        const categoriesHashMap = {};
        articleRows.forEach((postRow) => {
          // I make a lot of assumptions about correctness of data returned here
          const issueNumber = postRow.issue_order;
          // Here I handle finding the corresponding category row and thereby the order
          // this category should be in, and also use hashing as we will be looking this up often.
          let categoryIndex;
          if (
            categoriesHashMap.hasOwnProperty(issueNumber)
            && categoriesHashMap[issueNumber].hasOwnProperty(postRow.category_id)) {
            categoryIndex = categoriesHashMap[issueNumber][postRow.category_id];
          } else {
            const correspondingCategoryRow = categoryRows.find(categoryRow => (
              categoryRow.issue_order === issueNumber
                && categoryRow.category_id === postRow.category_id
            ));
            if (correspondingCategoryRow === undefined) {
              throw new Error("can't find order of the category of a post");
            }
            if (!categoriesHashMap.hasOwnProperty[issueNumber]) {
              categoriesHashMap[issueNumber] = {};
            }
            // Since we did the previous check it must not also have the articles key
            if (categoriesHashMap[issueNumber].hasOwnProperty(postRow.category_id)) {
              throw new Error('Problem with if else statement in dbIssueCategoryArticleQuery');
            }
            categoryIndex
              = categoriesHashMap[issueNumber][postRow.category_id]
              = correspondingCategoryRow.categories_order
            ;
          }
          // Continue with rest of constants
          const postIndex = postRow.posts_order;
          const articleSlug = postRow.slug;
          if (!results.hasOwnProperty(issueNumber)) {
            results[issueNumber] = [];
          }
          if (!results[issueNumber].hasOwnProperty(categoryIndex)) {
            results[issueNumber][categoryIndex] = [];
          }
          if (results[issueNumber][categoryIndex].length !== postIndex) {
            throw new Error('Incorrect data returned from database regarding getting ' +
'articles in an issue. Articles either not existing or not ordered correctly');
          }
          results[issueNumber][categoryIndex].push(articleSlug);
        });
        // Check all categories are there and ordering is correct
        _.forEach(results, (categoryArray, issueNumber) => {
          for (let i = 0; i < categoryArray.length; i++) {
            if (!categoryArray.hasOwnProperty(i)) {
              throw new Error(`Problem with category ordering data. Either wrong ordering \
or missing category at issue number ${issueNumber} index ${i}`);
            }
          }
        });
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

export function issueQuery(issueNumbers, columns) {
  return new Promise((resolve) => {
    let processedColumns = columns;
    const hasIssueNumber = processedColumns.find(col => col === 'issue_order') !== undefined;
    if (!hasIssueNumber) {
      // use concat to do a copy instead of changing original pathSet
      // we push this so that we know which issue we are fetching data for
      processedColumns = processedColumns.concat(['issue_order']);
    }
    database.select(...processedColumns)
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

export function trendingQuery() {
  return new Promise((resolve) => {
    database.select('id')
    .from('issues')
    .orderBy('issue_order', 'desc')
    .whereNotNull('published_at')
    .limit(1)
    .then((issueRows) => {
      const latestIssueId = issueRows[0].id;

      database.select('slug')
      .from('articles')
      .innerJoin('issues_posts_order', 'issues_posts_order.article_id', '=', 'articles.id')
      .whereNotNull('gazelle_published_at')
      .where('issue_id', '=', latestIssueId)
      .orderBy('views', 'DESC')
      .limit(10)
      .then((articleRows) => {
        // At the moment if there were less than 5-7 articles in the issue
        // there wouldn't be enough to show, it is very easy to implement that it
        // just continues with the second-newest issue, it depends on what editors want
        resolve(articleRows);
      })
      .catch((e) => {
        throw new Error(e);
      });
    });
  });
}

export function relatedArticleQuery(slugs) {
  return new Promise((resolve) => {
    database.select('id')
    .from('issues')
    .orderBy('issue_order', 'desc')
    .whereNotNull('published_at')
    .limit(1)
    .then((issueRows) => {
      const latestIssueId = issueRows[0].id;
      database.select('tag_id', 'articles.slug',
        'issues_posts_order.issue_id', 'category_id')
      .from('articles')
      .leftJoin('posts_tags', 'posts_tags.article_id', '=', 'articles.id')
      .innerJoin('issues_posts_order', 'issues_posts_order.article_id', '=', 'articles.id')
      .whereNotNull('gazelle_published_at')
      // We need the non-arrow function here to have the `this` object passed
      .where(function () { // eslint-disable-line
        this.where('issues_posts_order.issue_id', '=', latestIssueId).orWhereIn('slug', slugs);
      })
      .then((articleRows) => {
        const articles = {};
        articleRows.forEach((post) => {
          const slug = post.slug;
          if (!articles[slug]) {
            articles[slug] = post;
            articles[slug].tags = [];
          }
          // We could have several instances of the same article if it
          // exists in different issues, but it would only be relevant for the
          // target articles and therefore it's not a problem as we never iterate
          // through the target articles' tags.
          if (post.tag_id) {
            articles[slug].tags.push(post.tag_id);
          }
        });

        const results = {};
        slugs.forEach((slug) => {
          const post = articles[slug];
          if (post === undefined) {
            // Most likely this means a garbage URL was accessed
            if (process.env.NODEENV !== 'production') {
              // eslint-disable-next-line no-console
              console.warn(`Article ${slug} couldn't be found in related articles query`);
            }
          } else {
            // update amount of tags in common with current post
            // and whether the category is the same
            _.forEach(articles, (currentPost) => {
              let cnt = 0;
              currentPost.tags.forEach((currentTag) => {
                if (post.tags.find(postTag => postTag === currentTag)) {
                  cnt++;
                }
              });
              // eslint-disable-next-line no-param-reassign
              currentPost.tagsInCommon = cnt;
              // eslint-disable-next-line no-param-reassign
              currentPost.categoryInCommon = currentPost.category_id === post.category_id;
            });

            const ranking = Object.keys(articles).filter(currentSlug => (
              articles[currentSlug].issue_id === latestIssueId && currentSlug !== post.slug
            ));
            if (ranking.length < 3) {
              throw new Error('Less than three articles to qualify as related articles');
            }
            stable.inplace(ranking, (slugA, slugB) => {
              const a = articles[slugA];
              const b = articles[slugB];
              if (a.tagsInCommon !== b.tagsInCommon) {
                // This puts a before b if a has more tags in common
                return b.tagsInCommon - a.tagsInCommon;
              }
              if (a.categoryInCommon !== b.categoryInCommon) {
                if (a.categoryInCommon) {
                  return -1;
                }
                return 1;
              }
              return 0;
            });
            // since the sort is stable we know we should always get the
            // same values, also if there are no articles with related tags
            // or categories. It should still be deterministic which article
            // is the first unrelated one in the order
            results[slug] = ranking.slice(0, 3);
          }
        });
        resolve(results);
      });
    });
  });
}

export function searchAuthorsQuery(queries, min, max) {
  return new Promise((resolve) => {
    let queriesReturned = 0;
    const results = {};
    queries.forEach((query) => {
      database.select('slug')
      .from('authors')
      .where('name', 'like', `%${query}%`)
      .limit(max - min + 1)
      .offset(min)
      .then((rows) => {
        queriesReturned++;
        results[query] = _.map(rows, row => row.slug);
        if (queriesReturned >= queries.length) {
          resolve(results);
        }
      });
    });
  });
}

export function searchPostsQuery(queries, min, max) {
  return new Promise((resolve) => {
    let queriesReturned = 0;
    const results = {};
    queries.forEach((query) => {
      database.select('slug')
      .from('articles')
      .leftJoin('articles', 'articles.id', '=', 'articles.id')
      .where('title', 'like', `%${query}%`)
      .orderByRaw('ISNULL(gazelle_published_at) DESC, gazelle_published_at DESC')
      .limit(max - min + 1)
      .offset(min)
      .then((rows) => {
        queriesReturned++;
        results[query] = _.map(rows, row => row.slug);
        if (queriesReturned >= queries.length) {
          resolve(results);
        }
      });
    });
  });
}

export function searchTeamsQuery(queries, min, max) {
  return new Promise((resolve) => {
    let queriesReturned = 0;
    const results = {};
    queries.forEach((query) => {
      database.select('slug')
      .from('teams')
      .where('name', 'like', `%${query}%`)
      .limit(max - min + 1)
      .offset(min)
      .then((rows) => {
        queriesReturned++;
        results[query] = _.map(rows, row => row.slug);
        if (queriesReturned >= queries.length) {
          resolve(results);
        }
      });
    });
  });
}

// Suggestion: rename to updateArticleAuthors
export function updateAuthors(articleId, newAuthors) {
  return new Promise((resolve) => {
    database('authors_posts').where('article_id', '=', articleId).del()
    .then(() => {
      const insertArray = _.map(newAuthors, author_id => ({
        article_id: articleId,
        author_id,
      }));
      database('authors_posts').insert(insertArray).then(() => {
        database.select('slug')
        .from('authors_posts')
        .innerJoin('authors', 'authors.id', '=', 'authors_posts.author_id')
        .where('article_id', '=', articleId)
        .then(rows => resolve(rows.map(row => row.slug)));
      });
    });
  });
}

export function updateGhostFields(jsonGraphArg) {
  return new Promise((resolve) => {
    const updatesCalled = Object.keys(jsonGraphArg).length;
    let updatesReturned = 0;
    _.forEach(jsonGraphArg, (article, slug) => {
      const acceptedFields = {
        image_url: true,
        teaser: true,
      };
      const updateObject = {};
      _.forEach(article, (value, field) => {
        if (!acceptedFields[field]) {
          throw new Error('updateGhostFields is only configured to update image_url or teaser, ' +
'you cannot update', field);
        } else {
          updateObject[field] = value;
        }
      });
      database('articles')
      .where('slug', '=', slug)
      .update(updateObject)
      .then((data) => {
        if (data !== 1) {
          throw new Error('error updating ghost field of article with slug:', slug);
        }
        updatesReturned++;
        if (updatesReturned >= updatesCalled) {
          // Just resolving to show everything went as planned
          resolve(true);
        }
      });
    });
  });
}

export function updatePostMeta(jsonGraphArg) {
  return new Promise((resolve) => {
    const updatesCalled = Object.keys(jsonGraphArg).length;
    let updatesReturned = 0;
    const categorySlugsToFind = [];
    const articlesWithChangedCategory = [];
    _.forEach(jsonGraphArg, (article, slug) => {
      Object.keys(article).forEach((field) => {
        if (field === 'category') {
          categorySlugsToFind.push(article[field]);
          articlesWithChangedCategory.push(slug);
        }
      });
    });
    database.select('id', 'slug')
    .from('categories')
    .whereIn('slug', categorySlugsToFind)
    .then((categoryRows) => {
      const articleSlugs = Object.keys(jsonGraphArg);
      database.select('id', 'slug')
      .from('articles')
      .whereIn('slug', articleSlugs)
      .then((articleRows) => {
        _.forEach(jsonGraphArg, (article, slug) => {
          const updateObject = {};
          _.forEach(article, (value, field) => {
            if (field === 'category') {
              const category = categoryRows.find(row => row.slug === value);
              if (!category) {
                throw new Error(`Can't find ${value} as a category to add`);
              }
              updateObject.category_id = category.id;
            } else if (field === 'published_at') {
              updateObject.gazelle_published_at = value;
            } else {
              updateObject[field] = value;
            }
          });

          const articleObject = articleRows.find(row => row.slug === slug);
          if (!articleObject) {
            throw new Error(`Can't find ${slug} as an article to update`);
          }

          // We default to insert, with a conditional statement to update
          // if that id already exists to handle the case where we haven't yet
          // created a meta data row for that post
          const insertObject = Object.assign({}, updateObject, { id: articleObject.id });
          const insertQuery = database('articles').insert(insertObject).toString();
          // Using a fixed array of keys to make sure we have the same order every time
          const fields = Object.keys(updateObject);
          let rawUpdateQuery = '';
          fields.forEach((field) => {
            rawUpdateQuery += ` ${field} = :${field}`;
          });
          const query = `${insertQuery} ON DUPLICATE KEY UPDATE\
${database.raw(rawUpdateQuery, updateObject)}`;

          database.raw(query)
          .then((data) => {
            if (data.length < 1 || data[0].constructor.name !== 'OkPacket') {
              throw new Error(`Problems updating meta data of article: ${slug}`);
            }
            updatesReturned++;
            if (updatesReturned >= updatesCalled) {
              // If categories changed make sure issue data is still consistent
              if (articlesWithChangedCategory.length > 0) {
                database.distinct('issue_id').select()
                .from('issues_posts_order')
                .innerJoin('articles', 'articles.id', '=', 'issues_posts_order.article_id')
                .whereIn('articles.slug', articlesWithChangedCategory)
                .then((issueRows) => {
                  const issuesToUpdate = issueRows.map(row => row.issue_id);
                  // If the articles were actually published in any issues
                  if (issuesToUpdate.length > 0) {
                    this.orderArticlesInIssues(issuesToUpdate).then((flag) => {
                      if (flag !== true) {
                        throw new Error(`error while reordering articles in issues: \
${JSON.stringify(issuesToUpdate)}`);
                      }
                      resolve(true);
                    });
                  } else {
                    // Nothing to fix
                    resolve(true);
                  }
                });
              }
            }
          });
        });
      });
    });
  });
}

export function orderArticlesInIssues(issues) {
  // Issues is assumed to be an array of integers where
  // the integers are the ids of issues
  return new Promise((resolve) => {
    let updatesCalled = 0;
    let updatesReturned = 0;
    issues.forEach((issue_id) => {
      // Get the current categories so we know if we have to add new ones
      // or delete old ones
      database.select('category_id', 'categories_order')
      .from('issues_categories_order')
      .where('issue_id', '=', issue_id)
      .orderBy('categories_order', 'ASC')
      .then((categoryRows) => {
        database.select('issues_posts_order.id as id', 'category_id', 'posts_order')
        .from('issues_posts_order')
        .innerJoin('articles', 'articles.id', '=', 'issues_posts_order.article_id')
        .where('type', '=', 0)
        .where('issue_id', '=', issue_id)
        .orderBy('category_id', 'ASC')
        .orderBy('issues_posts_order.posts_order', 'ASC')
        .then((articleRows) => {
          let lastCategory = null;
          let order = 0;
          const toUpdate = [];
          const newCategories = [];
          articleRows.forEach((row) => {
            if (lastCategory !== row.category_id) {
              lastCategory = row.category_id;
              order = 0;
              newCategories.push(row.category_id);
            }
            if (order !== row.posts_order) {
              toUpdate.push({
                id: row.id,
                update: {
                  posts_order: order,
                },
              });
            }
            order++;
          });
          updatesCalled += toUpdate.length;
          toUpdate.forEach((obj) => {
            database('issues_posts_order')
            .where('id', '=', obj.id)
            .update(obj.update)
            .then(() => {
              updatesReturned++;
              if (updatesReturned >= updatesCalled) {
                resolve(true);
              }
            });
          });
          // Check if categories are still consistent
          let newCategoriesWithOrder = [];
          let consistent = true;
          categoryRows.forEach((category) => {
            if (newCategories.find(
              cat => cat === category.category_id) !== undefined) {
              newCategoriesWithOrder.push(category);
            } else {
              consistent = false;
            }
          });
          newCategories.forEach((category_id) => {
            if (newCategoriesWithOrder.find(
              cat => cat.category_id === category_id) === undefined) {
              consistent = false;
              const foundHole = newCategoriesWithOrder.some((cat, index) => {
                if (index !== cat.categories_order) {
                  newCategoriesWithOrder.splice(index, 0, {
                    category_id,
                    categories_order: index,
                  });
                  return true;
                }
                return false;
              });
              if (!foundHole) {
                newCategoriesWithOrder.push({
                  category_id,
                  categories_order: newCategoriesWithOrder.length,
                });
              }
            }
          });
          if (!consistent) {
            newCategoriesWithOrder = newCategoriesWithOrder.map((cat, index) => ({
              ...cat,
              categories_order: index,
              issue_id,
            }));
            updatesCalled++;
            // Delete the current categories order and insert the new one
            database('issues_categories_order').where('issue_id', '=', issue_id).del()
            .then(() => {
              database('issues_categories_order').insert(newCategoriesWithOrder)
              .then(() => {
                updatesReturned++;
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

export function updateMainAuthorData(jsonGraphArg) {
  return new Promise((resolve) => {
    const updatesCalled = Object.keys(jsonGraphArg).length;
    let updatesReturned = 0;
    _.forEach(jsonGraphArg, (authorObject, slug) => {
      database('authors').where('slug', '=', slug)
      .update(authorObject)
      .then((data) => {
        if (data !== 1) {
          throw new Error(`Problems updating main author data of: ${slug}`);
        }
        updatesReturned++;
        if (updatesReturned >= updatesCalled) {
          resolve(true);
        }
      })
      .catch((e) => {
        throw e;
      });
    });
  });
}

// Refactoring suggestion: rename to `addAuthor`
// to follow the style of the rest of the code
export function createAuthor(authorObject) {
  return new Promise((resolve) => {
    database('authors').insert(authorObject)
    .then(() => {
      // Insert statements should throw errors themselves
      // if they fail
      resolve(true);
    });
  });
}

export function updateIssueArticles(issueNumber, featuredArticles, picks, mainArticles) {
  // First we reset all issue, article, category relationships
  // This is simply to make our job easier, and update statements
  // don't have to be exceedingly efficient either as they are called
  // very rarely, and the user expects a wait time on saving changes
  return new Promise((resolve) => {
    database.select('id', 'published_at')
    .from('issues')
    .where('issue_order', '=', issueNumber)
    .then((issues) => {
      if (issues.length !== 1) {
        throw new Error('issue_order should be unique');
      }
      const issue_id = issues[0].id;
      const issuePublished = issues[0].published_at instanceof Date;
      database('issues_posts_order')
      .where('issue_id', '=', issue_id)
      .del()
      .then(() => {
        database('issues_categories_order')
        .where('issue_id', '=', issue_id)
        .del()
        .then(() => {
          // Now we can start inserting from scratch
          const articlesInsert = [];
          featuredArticles.forEach((article, index) => {
            articlesInsert.push({
              issue_id,
              type: 1,
              article_id: article.id,
              posts_order: index,
            });
          });

          picks.forEach((article, index) => {
            articlesInsert.push({
              issue_id,
              type: 2,
              article_id: article.id,
              posts_order: index,
            });
          });

          // We sort them by category so we can keep track of
          // the order within each category
          mainArticles.sort((a, b) => {
            const categoryA = a.category;
            const categoryB = b.category;
            if (!categoryA || !categoryB) {
              throw new Error('all articles should have a category' +
                ' when being inserted into an issue');
            }
            if (categoryA > categoryB) {
              return 1;
            } if (categoryA === categoryB) {
              return 0;
            }
            return -1;
          });

          let articleIssueOrder = 0;
          mainArticles.forEach((article, index) => {
            if (index > 0) {
              if (mainArticles[index].category !== mainArticles[index - 1].category) {
                articleIssueOrder = 0;
              }
            }
            articlesInsert.push({
              issue_id,
              type: 0,
              article_id: article.id,
              posts_order: articleIssueOrder,
            });
            articleIssueOrder++;
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
                  issue_id,
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
                      path: ['issues', 'byNumber', issueNumber, 'categories'],
                      invalidated: true,
                    },
                    {
                      path: ['issues', 'byNumber', issueNumber, 'featured'],
                      invalidated: true,
                    },
                    {
                      path: ['issues', 'byNumber', issueNumber, 'picks'],
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
                      path: ['issues', 'byNumber', issueNumber, 'featured'],
                      value: { $type: 'ref', value: ['articles', 'bySlug', article.slug] },
                    };
                  }
                });

                picks.forEach((article, index) => {
                  if (index === 0) {
                    // Only create the key if picks is non-empty
                    data.picks = [];
                  }
                  data.picks.push({
                    path: ['issues', 'byNumber', issueNumber, 'picks', index],
                    value: { $type: 'ref', value: ['articles', 'bySlug', article.slug] },
                  });
                });

                let articleIndex = 0;
                // add order to the category objects
                categories.forEach((category, index) => {
                  slugToObject[category].index = index;
                });
                mainArticles.forEach((article, index) => {
                  if (index === 0) {
                    // initialize it since mainArticles was non-empty
                    const category = slugToObject[article.category];
                    data.categories = {
                      [category.index]: {
                        name: category.name,
                        slug: category.slug,
                        articles: [{
                          path: [
                            'issues', 'byNumber',
                            issueNumber,
                            'categories',
                            category.index,
                            'articles',
                            articleIndex,
                          ],
                          value: { $type: 'ref', value: ['articles', 'bySlug', article.slug] },
                        }],
                      },
                    };
                  } else if (mainArticles[index].category !== mainArticles[index - 1].category) {
                    // index > 0
                    // It's a new category
                    articleIndex = 0;
                    const category = slugToObject[article.category];
                    data.categories[category.index] = {
                      name: category.name,
                      slug: category.slug,
                      articles: [{
                        path: [
                          'issues', 'byNumber',
                          issueNumber,
                          'categories',
                          category.index,
                          'articles',
                          articleIndex,
                        ],
                        value: { $type: 'ref', value: ['articles', 'bySlug', article.slug] },
                      }],
                    };
                  } else {
                    // We're just adding to the old category
                    const category = slugToObject[article.category];
                    data.categories[category.index].articles.push({
                      path: [
                        'issues', 'byNumber',
                        issueNumber,
                        'categories',
                        category.index,
                        'articles',
                        articleIndex,
                      ],
                      value: { $type: 'ref', value: ['articles', 'bySlug', article.slug] },
                    });
                  }
                  // Increment the order
                  articleIndex++;
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
                        path: ['articles', 'bySlug', article.slug, 'published_at'],
                        value: date.getTime(),
                      });
                      return true;
                    }
                    return false;
                  }).map(article => article.id);

                  database('articles').whereIn('id', toPublish)
                  .update('gazelle_published_at', moment(date).format('YYYY-MM-DD HH:mm:ss'))
                  .then(() => {
                    resolve(results);
                  });
                } else {
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

export function updateIssueData(jsonGraphArg) {
  return new Promise((resolve) => {
    const issueNumber = Object.keys(jsonGraphArg.issues.byNumber)[0];
    const issueObject = jsonGraphArg.issues.byNumber[issueNumber];
    const updateObject = {};
    if (issueObject.hasOwnProperty('name') && issueObject.name) {
      updateObject.name = issueObject.name;
    }
    if (issueObject.hasOwnProperty('published_at') &&
      (issueObject.published_at || issueObject.published_at === null)) {
      updateObject.published_at = moment(issueObject.published_at).format('YYYY-MM-DD');
    }
    if (issueObject.hasOwnProperty('issueNumber') && issueObject.issueNumber) {
      updateObject.issue_order = issueObject.issueNumber;
    }
    database('issues').where('issue_order', '=', issueNumber)
    .update(updateObject)
    .then(() => {
      resolve(true);
    });
  });
}

export function publishIssue(issue_id) {
  return new Promise((resolve) => {
    // We first find all unpublished articles in the issue
    database.select('articles.id', 'slug', 'gazelle_published_at')
    .from('articles')
    .innerJoin('issues_posts_order', 'articles.id', '=', 'issues_posts_order.article_id')
    .where('issue_id', '=', issue_id)
    .then((articles) => {
      const dateObject = new Date();
      const results = {
        publishedArticles: [],
        date: dateObject,
      };
      // I could've used whereNull here to only get the filtered version
      // but I hope to catch other mistakes like if an invalid
      // date was input and the value was then 0000-00-00 00:00:00 it wouldn't
      // be caught otherwise
      const toPublish = [];
      articles.forEach((article) => {
        if (!(article.published_at instanceof Date)) {
          // This is not published
          toPublish.push(article.id);
          results.publishedArticles.push(article.slug);
        }
      });
      const currentTime = moment(dateObject).format('YYYY-MM-DD HH:mm:ss');
      database('articles')
      .whereIn('id', toPublish)
      .update({ gazelle_published_at: currentTime })
      .then(() => {
        // Now we can publish the issue
        const currentDate = moment(dateObject).format('YYYY-MM-DD');
        database('issues')
        .where('id', '=', issue_id)
        .update({ published_at: currentDate })
        .then(() => {
          resolve(results);
        });
      });
    });
  });
}

export function addIssue(issueObject) {
  return new Promise((resolve) => {
    const insertObject = {};
    _.forEach(issueObject, (value, key) => {
      insertObject[key] = value;
    });
    database('issues').insert(insertObject).then(() => {
      resolve(true);
    });
  });
}

export function updateIssueCategories(issueNumber, idArray) {
  return new Promise((resolve) => {
    // First delete old categories order and get issue id
    database.select('id')
    .from('issues')
    .where('issue_order', '=', issueNumber)
    .then((rows) => {
      if (!rows || !rows.length || !rows[0].id) {
        throw new Error('Invalid issue number passed to updateIssueCategories');
      }
      const issue_id = rows[0].id;
      database('issues_categories_order')
      .where('issue_id', '=', issue_id)
      .del()
      .then(() => {
        // Insert the new categories
        const toInsert = idArray.map((id, index) => ({
          category_id: id,
          issue_id,
          categories_order: index,
        }));
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
    });
  });
}

export function addView(slug) {
  return new Promise((resolve) => {
    database.select('articles.id', 'views')
    .from('articles')
    .where('slug', '=', slug)
    .then((rows) => {
      if (rows.length === 0) {
        resolve(false);
      } else {
        const row = rows[0];
        const views = row.views + 1;
        const id = row.id;
        database('articles')
        .where('id', '=', id)
        .update('views', views)
        .then(() => {
          resolve(views);
        });
      }
    });
  });
}

export function addTeam(teamObject) {
  return new Promise((resolve) => {
    const insertObject = {};
    _.forEach(teamObject, (value, key) => {
      insertObject[key] = value;
    });
    database('teams').insert(insertObject).then(() => {
      resolve(true);
    });
  });
}

export function updateTeams(jsonGraphArg) {
  return new Promise((resolve) => {
    const updatesCalled = Object.keys(jsonGraphArg).length;
    let updatesReturned = 0;
    _.forEach(jsonGraphArg, (teamObject, slug) => {
      database('teams').where('slug', '=', slug)
      .update(teamObject)
      .then((data) => {
        if (data !== 1) {
          throw new Error(`Problems updating team data of: ${slug}`);
        }
        updatesReturned++;
        if (updatesReturned >= updatesCalled) {
          resolve(true);
        }
      })
      .catch((e) => {
        throw e;
      });
    });
  });
}

export function getLatestSemester() {
  return new Promise((resolve) => {
    database.select('name')
    .from('semesters')
    .orderBy('date', 'DESC')
    .limit(1)
    .then((rows) => {
      if (rows.length !== 1) {
        throw new Error('Problems fetching latest semester');
      }
      resolve(rows[0].name);
    })
    .catch((e) => {
      throw e;
    });
  });
}

export function getSemesterMembers(semesterName, teamIndices, memberIndices) {
  return new Promise((resolve) =>
    database.select('teams.slug as teamSlug', 'authors.slug as authorSlug', 'team_order', 'author_order') // eslint-disable-line max-len
    .from('teams_authors')
    .innerJoin('semesters', 'semesters.id', '=', 'semester_id')
    .innerJoin('teams', 'teams.id', '=', 'team_id')
    .innerJoin('authors', 'authors.id', '=', 'author_id')
    .where('semesters.name', '=', semesterName)
    .whereIn('team_order', teamIndices)
    .whereIn('author_order', memberIndices)
    .then(rows => {
      const data = {};
      rows.forEach(row => {
        if (!data.hasOwnProperty(row.team_order)) {
          data[row.team_order] = {};
        }
        data[row.team_order][row.author_order] = row.authorSlug;
      });
      resolve(data);
    })
  );
}

export function getSemesterTeams(semesterName, teamIndices) {
  return new Promise((resolve) => (
    database.distinct('teams.slug as teamSlug', 'team_order') // eslint-disable-line max-len
    .from('teams_authors')
    .innerJoin('semesters', 'semesters.id', '=', 'semester_id')
    .innerJoin('teams', 'teams.id', '=', 'team_id')
    .where('semesters.name', '=', semesterName)
    .whereIn('team_order', teamIndices)
    .then(rows => {
      resolve(rows);
    })
  ));
}
