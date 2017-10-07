import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import EditorSearchBar from 'components/editor/EditorSearchBar';
import EditorList from 'components/editor/EditorList';
import _ from 'lodash';
import update from 'react-addons-update';
import { formatDate } from 'lib/utilities';

// material-ui
import CircularProgress from 'material-ui/CircularProgress';

const ARTICLE_FIELDS = ['id', 'title', 'slug', 'category',
  'published_at', 'html', 'is_interactive'];
const ARTICLE_LIST_LENGTH = 100;

const styles = {
  paper: {
    height: '100%',
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'left',
    display: 'inline-block',
  },
  tabs: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 15,
  },
  buttons: {
    marginTop: 12,
    marginBottom: 24,
  },
};

export default class EditorIssueArticleController extends FalcorController {
  constructor(props) {
    super(props);
    this.saveChanges = this.saveChanges.bind(this);
    this.handleArticlesChange = this.handleArticlesChange.bind(this);
    this.makeUnique = this.makeUnique.bind(this);
    this.safeSetState({
      changed: false,
      saving: false,
      showArticleListMode: 'none',
      mainArticles: [],
      featuredArticles: [],
      picks: [],
    });
  }

  static getFalcorPathSets(params) {
    return [
      ['issues', 'byNumber', params.issueNumber, ['name', 'published_at']],
      [
        'issues', 'byNumber',
        params.issueNumber,
        'categories',
        { length: 20 },
        'articles',
        { length: 50 },
        ARTICLE_FIELDS,
      ],
      ['issues', 'byNumber', params.issueNumber, 'featured', ARTICLE_FIELDS],
      ['issues', 'byNumber', params.issueNumber, 'picks', { length: 10 }, ARTICLE_FIELDS],
      /* The following three calls are simply calling the first author to check
       *if any author has been assigned
        this is used for validiy checking */
      [
        'issues', 'byNumber',
        params.issueNumber,
        'categories',
        { length: 20 },
        'articles',
        { length: 50 },
        'authors',
        0,
        'slug',
      ],
      ['issues', 'byNumber', params.issueNumber, 'featured', 'authors', 0, 'slug'],
      ['issues', 'byNumber', params.issueNumber, 'picks', { length: 10 }, 'authors', 0, 'slug'],
      // This is for the articleList
      [
        'articles',
        'byPage',
        ARTICLE_LIST_LENGTH,
        1,
        { length: ARTICLE_LIST_LENGTH },
        ARTICLE_FIELDS,
      ],
      [
        'articles', 'byPage',
        ARTICLE_LIST_LENGTH,
        1,
        { length: ARTICLE_LIST_LENGTH },
        'authors',
        0,
        'slug',
      ],
    ];
  }

  componentWillMount() {
    const falcorCallBack = (data) => {
      const issueNumber = this.props.params.issueNumber;
      const issueData = data.issues.byNumber[issueNumber];
      const mainArticles = [];
      _.forEach(issueData.categories, (category) => {
        _.forEach(category.articles, (article) => {
          mainArticles.push(article);
        });
      });
      const featuredArticles = issueData.featured ? [issueData.featured] : [];
      const picks = issueData.picks ? _.map(issueData.picks, (val) => val) : [];
      this.safeSetState({
        mainArticles,
        featuredArticles,
        picks,
      });
    };
    super.componentWillMount(falcorCallBack);
  }

  componentWillReceiveProps(nextProps) {
    const falcorCallBack = (data) => {
      const issueNumber = this.props.params.issueNumber;
      const issueData = data.issues.byNumber[issueNumber];
      const mainArticles = [];
      _.forEach(issueData.categories, (category) => {
        _.forEach(category.articles, (article) => {
          mainArticles.push(article);
        });
      });
      const featuredArticles = issueData.featured ? [issueData.featured] : [];
      const picks = issueData.picks ? _.map(issueData.picks, (val) => val) : [];
      this.safeSetState({
        mainArticles,
        featuredArticles,
        picks,
      });
    };
    super.componentWillReceiveProps(nextProps, undefined, falcorCallBack);
    this.safeSetState({
      changed: false,
      saving: false,
      showArticleListMode: 'none',
    });
  }

  handleArticlesChange(newArticles, mode) {
    const issueNumber = this.props.params.issueNumber;
    const data = this.state.data.issues.byNumber[issueNumber];

    // Get all the variables set for each corresponding mode
    let originalArticles;
    let field1;
    let field2;
    let old1;
    let old2;
    switch (mode) {
      case 'featured':
        originalArticles = data.featured ? [data.featured] : [];
        field1 = this.state.picks;
        old1 = data.picks ? _.map(data.picks, val => val) : [];
        field2 = this.state.mainArticles;
        old2 = [];
        _.forEach(data.categories, (category) => {
          _.forEach(category.articles, (article) => {
            old2.push(article);
          });
        });
        break;
      case 'picks':
        originalArticles = data.picks ? _.map(data.picks, val => val) : [];
        field1 = this.state.featuredArticles;
        old1 = data.featured ? [data.featured] : [];
        field2 = this.state.mainArticles;
        old2 = [];
        _.forEach(data.categories, (category) => {
          _.forEach(category.articles, (article) => {
            old2.push(article);
          });
        });
        break;
      case 'main':
        originalArticles = [];
        _.forEach(data.categories, (category) => {
          _.forEach(category.articles, (article) => {
            originalArticles.push(article);
          });
        });
        field1 = this.state.featuredArticles;
        old1 = data.featured ? [data.featured] : [];
        field2 = this.state.picks;
        old2 = data.picks ? _.map(data.picks, val => val) : [];
        break;
      default:
        throw new Error('Wrong mode passed to handleArticlesChange');
    }


    // It will only run the check if they are the same length
    // because of short circuiting
    let changedFlag = (newArticles.length !== originalArticles.length ||
      // The two arrays must be same size, and therefore this check is valid
      newArticles.some(article => (
        originalArticles.find(post => post.slug === article.slug) === undefined
      ))
    );

    // If the changedFlag of this one set of articles
    // is the same as before, no change is possible independent
    // of the other fields
    if (changedFlag !== this.state.changed) {
      // The special case to consider where we need to check
      // the other fields is the one where this set of articles
      // is the last one to go back to unchanged
      if (changedFlag === false) {
        // The function wants to change to no changes
        // so we double check the other fields don't have changes
        changedFlag = (changedFlag ||
          field1.length !== old1.length ||
          field1.some((article) => (
            old1.find((post) => article.slug === post.slug) === undefined
          ))
        );
        if (changedFlag === true) {
          // It was a false alarm
          return;
        }
        changedFlag = (changedFlag ||
          field2.length !== old2.length ||
          field2.some((article) =>
           old2.find((post) =>
            article.slug === post.slug) === undefined));
        if (changedFlag === true) {
          // It was a false alarm
          return;
        }
      }
      this.safeSetState({ changed: changedFlag });
    }
  }

  addArticle(mode, post) {
    // The original article object and the key
    // in state in which the new object will be inserted
    let articles;
    let key;
    switch (mode) {
      case 'featured':
        articles = this.state.featuredArticles;
        key = 'featuredArticles';
        break;
      case 'picks':
        articles = this.state.picks;
        key = 'picks';
        break;
      case 'main':
        articles = this.state.mainArticles;
        key = 'mainArticles';
        break;
      default:
        throw new Error('Wrong mode passed to addArticle');
    }

    // Check if it is already picked in the issue
    const allArticles = this.state.mainArticles.concat(
      this.state.picks,
      this.state.featuredArticles
    );
    if (allArticles.some(article => article.slug === post.slug)) {
      window.alert('That post is already in the issue');
      return;
    }
    const newArticles = update(articles, { $push: [post] });
    // We pass in the new value as safeSetState is asynchronous
    this.handleArticlesChange(newArticles, mode);
    this.safeSetState({
      [key]: newArticles,
    });
  }

  deleteArticle(mode, post) {
    // The original article object and the key
    // in state in which the object will be deleted from
    let articles;
    let key;
    switch (mode) {
      case 'featured':
        articles = this.state.featuredArticles;
        key = 'featuredArticles';
        break;
      case 'picks':
        articles = this.state.picks;
        key = 'picks';
        break;
      case 'main':
        articles = this.state.mainArticles;
        key = 'mainArticles';
        break;
      default:
        throw new Error('Wrong mode passed to addArticle');
    }

    const index = articles.findIndex(article => article.slug === post.slug);
    if (index === -1) {
      throw new Error('Article asked to be deleted was not found');
    }
    const newArticles = update(articles, { $splice: [[index, 1]] });
    // We pass in the new value as safeSetState is asynchronous
    this.handleArticlesChange(newArticles, mode);
    this.safeSetState({
      [key]: newArticles,
    });
  }

  saveChanges() {
    const issueNumber = this.props.params.issueNumber;
    const featuredArticles = this.state.featuredArticles;
    const picks = this.state.picks;
    const mainArticles = this.state.mainArticles;
    const data = this.state.data.issues.byNumber[issueNumber];
    const isPublished = data.published_at;

    const allArticles =
      this.state.mainArticles.concat(this.state.picks, this.state.featuredArticles);
    const allSlugs = allArticles.map((article) => article.slug);
    // check for uniqueness
    if (_.uniq(allSlugs).length !== allSlugs.length) {
      window.alert("You have duplicate articles, as this shouldn't be able" +
        ' to happen, please contact developers. And if you know all the actions' +
        ' you did previously to this and can reproduce them that would be of great help.' +
        ' The save has been cancelled. (Remember you can also use the remove duplicates button' +
        ' for a current fix');
      return;
    }
    if (allSlugs.length === 0) {
      window.alert("Sorry, because of some non-trivial issues we currently don't have" +
        " deleting every single article implemented. You hopefully shouldn't need this function" +
        ' either. Please re-add an article to be able to save');
      return;
    }
    const allArticlesHaveCategories = allArticles.every(article => {
      if (!article.hasOwnProperty('category') || !article.category) {
        window.alert(
          `${article.title} has no category and can therefore not be added to an issue yet`
        );
        return false;
      }
      return true;
    });
    if (!allArticlesHaveCategories) {
      return;
    }
    if (isPublished) {
      // Check that all articles are valid since issue is already published
      const fields = ARTICLE_FIELDS.filter((field) => (
        field !== 'published_at' && field !== 'is_interactive'));
      const articlesValid = allArticles.every((article) => {
        const slug = article.slug;
        const isOldArticle = (
           _.some(data.categories, (category) => (
             _.some(category.articles, (post) => slug === post.slug)
          )) ||

          data.featured.slug === slug ||

          _.some(data.picks, (post) => post.slug === slug)
        );
        if (isOldArticle) {
          return true;
        }
        const fieldsValid = fields.every((field) => {
          // Special case for interactive articles, don't need html key
          if (article.is_interactive && field === 'html') {
            return true;
          }
          if (!article[field]) {
            window.alert(
              `${article.title} has no ${field}. Please correct this ` +
              'before adding the article to an already published issue'
            );
            return false;
          }
          return true;
        });
        if (!fieldsValid) {
          return false;
        }
        if (!article.hasOwnProperty('authors') || !article.authors[0]) {
          window.alert(
            `${article.title} has no authors assigned. Please correct this ` +
            'before adding the article to an already published issue'
          );
          return false;
        }
        if (/http(?!s)/.test(article.html)) {
          if (!window.confirm(
              `${article.title} has a non https link in it's body. ` +
              ' please make sure this link is not an image/video etc. being loaded in. ' +
              ' If you are sure of this press okay to continue, else cancel to check.'
            )
          ) {
            return false;
          }
        }
        return true;
      });
      if (!articlesValid) {
        return;
      }
    }

    const resetState = () => {
      this.safeSetState({
        changed: false,
      });
      // Set timeout so "saved" message shows for a while
      setTimeout(() => {
        this.safeSetState({ saving: false });
        window.alert('Remember that categories have now been put in a random' +
          ' order as you changed the articles. Please go check that they are' +
          ' ordered as you wish.');
      }, 1000);
    };

    const refPaths = ARTICLE_FIELDS.map(field => [field]);
    this.safeSetState({ saving: true });
    this.falcorCall(['issues', 'byNumber', 'updateIssueArticles'],
      [issueNumber, featuredArticles, picks, mainArticles],
      refPaths, undefined, undefined, resetState);
  }

  makeUnique() {
    let mainArticles = this.state.mainArticles;
    let featuredArticles = this.state.featuredArticles;
    let picks = this.state.picks;
    const seen = {};
    featuredArticles = featuredArticles.filter((article) => {
      if (seen[article.slug]) {
        return false;
      }
      seen[article.slug] = true;
      return true;
    });
    picks = picks.filter((article) => {
      if (seen[article.slug]) {
        return false;
      }
      seen[article.slug] = true;
      return true;
    });
    // By putting mainArticles at the bottom we make sure
    // that we prioritize keeping featured and picks and
    // removing the duplicates in mainArticles
    mainArticles = mainArticles.filter((article) => {
      if (seen[article.slug]) {
        return false;
      }
      seen[article.slug] = true;
      return true;
    });
    this.handleArticlesChange(mainArticles, 'main');
    this.safeSetState({
      featuredArticles,
      picks,
      mainArticles,
    });
  }

  createArticleListElement(mode, article) {
    let date;
    if (article.published_at) {
      date = formatDate(new Date(article.published_at));
    } else {
      date = 'Unpublished';
    }
    return (
      <div key={article.slug}>
        {/* eslint-disable react/jsx-no-bind */}
        <button
          type="button"
          className="pure-button"
          onClick={this.addArticle.bind(this, mode, article)}
        >{`${article.title} - ${date}`}</button>
        {/* eslint-enable react/jsx-no-bind */}
      </div>
    );
  }

  render() {
    if (this.state.ready) {
      if (!this.state.data) {
        return <div>This issue could not be found</div>;
      }
      const modes = ['picks', 'featured', 'main'];
      if (modes.find(mode => mode === this.state.showArticleListMode)) {
        // Filter picked articles
        let articles = this.state.data.articles.byPage[ARTICLE_LIST_LENGTH][1];
        const seen = {};
        const allArticles = this.state.mainArticles.concat(
          this.state.featuredArticles, this.state.picks);
        allArticles.forEach((article) => {
          seen[article.slug] = true;
        });
        articles = _.filter(articles, article => !seen[article.slug]);
        return (
          <div>
            {/* eslint-disable react/jsx-no-bind */}
            <EditorList
              elements={articles}
              maxHeight="50vh"
              createElement={this.createArticleListElement.bind(
                this,
                this.state.showArticleListMode
              )}
            />
            {/* eslint-enable react/jsx-no-bind */}
            <button
              type="button"
              className="pure-button"
              onClick={() => { this.safeSetState({ showArticleListMode: 'none' }); }}
            >Back</button>
          </div>
        );
      }
      const issueNumber = this.props.params.issueNumber;
      const data = this.state.data.issues.byNumber[issueNumber];
      const mainArticles = this.state.mainArticles;
      const featuredArticles = this.state.featuredArticles;
      const picks = this.state.picks;

      let changedStateMessage;
      const changedStateStyle = {};
      if (!this.state.changed) {
        if (!this.state.saving) {
          changedStateMessage = 'No Changes';
        } else {
          changedStateMessage = 'Saved';
          changedStateStyle.color = 'green';
        }
      } else {
        if (!this.state.saving) {
          changedStateMessage = 'Unsaved Changes';
          changedStateStyle.color = 'red';
        } else {
          changedStateMessage = 'Saving';
          changedStateStyle.color = '#65e765';
        }
      }
      return (
        <div style={styles.tabs}>
          <button
            type="button"
            className="pure-button"
            onClick={this.makeUnique}
          >Remove duplicates</button>
          <h2 style={changedStateStyle}>{changedStateMessage}</h2>
          <h3>{data.name}</h3>
          <p>
            Here you may decide which articles are going to be in the issue, and their roles.
            <br />At this moment in development please refresh the page after saving to see the
            correct data.
          </p>
          <h4 style={{ marginBottom: '0px', marginTop: '0px' }}>
            Featured Articles (please add exactly 1)
          </h4>
          <div>
            <button
              type="button"
              className="pure-button"
              onClick={() => { this.safeSetState({ showArticleListMode: 'featured' }); }}
            >Search By List</button>
            {/* eslint-disable react/jsx-no-bind */}
            <EditorSearchBar
              model={this.props.model}
              handleClick={this.addArticle.bind(this, 'featured')}
              length={3}
              fields={ARTICLE_FIELDS}
              disabled={this.state.saving}
              mode="articles"
              extraPathSets={[['authors', 0, 'slug']]}
              showPubDate
            />
            {
              featuredArticles.map(article => (
                <div key={article.slug}>
                  <button
                    type="button"
                    className="toggle-button"
                    aria-label="Remove post from featured"
                    onClick={this.deleteArticle.bind(this, 'featured', article)}
                    disabled={this.state.saving}
                  >&times;&nbsp;</button>
                  <div style={{ marginLeft: '1em' }}>{article.title}</div>
                </div>
              ))
            }
          </div>
          <h4 style={{ marginBottom: '0px', marginTop: '8px' }}>
            Editor's Picks (please add exactly 2)
          </h4>
          <div>
            <button
              type="button"
              className="pure-button"
              onClick={() => { this.safeSetState({ showArticleListMode: 'picks' }); }}
            >Search By List</button>
            <EditorSearchBar
              model={this.props.model}
              handleClick={this.addArticle.bind(this, 'picks')}
              length={3}
              fields={ARTICLE_FIELDS}
              disabled={this.state.saving}
              mode="articles"
              extraPathSets={[['authors', 0, 'slug']]}
              showPubDate
            />
            {
              picks.map(article => (
                <div key={article.slug}>
                  <button
                    type="button"
                    className="toggle-button"
                    aria-label="Remove post from picks"
                    onClick={this.deleteArticle.bind(this, 'picks', article)}
                    disabled={this.state.saving}
                  >&times;&nbsp;</button>
                  <div style={{ marginLeft: '1em' }}>{article.title}</div>
                </div>
              ))
            }
          </div>
          <h4 style={{ marginBottom: '0px', marginTop: '8px' }}>
            Main articles (add as many as you like)
          </h4>
          <div>
            <button
              type="button"
              className="pure-button"
              onClick={() => { this.safeSetState({ showArticleListMode: 'main' }); }}
            >Search By List</button>
            <EditorSearchBar
              model={this.props.model}
              handleClick={this.addArticle.bind(this, 'main')}
              length={3}
              fields={ARTICLE_FIELDS}
              disabled={this.state.saving}
              mode="articles"
              extraPathSets={[['authors', 0, 'slug']]}
              showPubDate
            />
            <div style={{ overflow: 'auto', maxHeight: '20vh' }}>
              {
                mainArticles.map(article => (
                  <div key={article.slug}>
                    <button
                      type="button"
                      className="toggle-button"
                      aria-label="Remove post from issue"
                      onClick={this.deleteArticle.bind(this, 'main', article)}
                      disabled={this.state.saving}
                    >&times;&nbsp;</button>
                    <div style={{ marginLeft: '1em' }}>{article.title}</div>
                  </div>
                ))
              }
            </div>
          </div>
          {/* eslint-enable react/jsx-no-bind */}
          <div style={{ fontSize: '1.2em' }}>
            <b>{mainArticles.length} articles</b>
          </div>
          <button
            type="button"
            className="pure-button pure-button-primary"
            aria-label="Save changes"
            onClick={this.saveChanges}
            disabled={this.state.saving || !this.state.changed}
          >Save Changes</button>
        </div>
      );
    }
    return (
      <div className="circular-progress">
        <CircularProgress />
      </div>
    );
  }
}
