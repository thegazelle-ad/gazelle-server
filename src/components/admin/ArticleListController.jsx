import React from 'react';
import { Link, browserHistory } from 'react-router';
import FalcorController from 'lib/falcor/FalcorController';
import { SearchableArticlesWithPubDate } from 'components/admin/form-components/searchables';
import { ArticleList } from 'components/admin/ArticleList';
import moment from 'moment';

// material-ui
import ListItem from 'material-ui/List/ListItem';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import { darkBlack } from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

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
    margin: 12,
    marginBottom: 24,
  },
};

const NUM_ARTICLES_IN_PAGE = 50;

export class ArticleListController extends FalcorController {
  constructor(props) {
    super(props);
    this.getNewPagePath = this.getNewPagePath.bind(this);
    this.clickSearchSuggestion = this.clickSearchSuggestion.bind(this);
    this.createListElement = this.createListElement.bind(this);
  }

  /* When we route back to ArticleListController after making changes
   * the FalcorData in ArticleListController is now out of date.
   * This makes ArticleListController update it's state to reflect
   * the data in the DB after making edits to an Article.
   * TODO - Pub-Sub model with React-Falcor||Falcor-React
   */
  componentWillReceiveProps(nextProps, nextContext) {
    super.componentWillReceiveProps(nextProps, nextContext);
    const newPathSets = this.constructor.getFalcorPathSets(
      nextProps.params,
      nextProps.location.query,
    );
    if (nextProps.location.state && nextProps.location.state.refresh) {
      this.falcorFetch(newPathSets);
    }
  }
  static getFalcorPathSets(params) {
    return [
      [
        'articles',
        'byPage',
        NUM_ARTICLES_IN_PAGE,
        parseInt(params.page, 10),
        { length: NUM_ARTICLES_IN_PAGE },
        ['title', 'id', 'teaser', 'published_at'],
      ],
      ['articles', 'length'],
    ];
  }

  getNewPagePath(delta) {
    let path = this.props.location.pathname;
    path = path.split('/');
    path[3] = (parseInt(path[3], 10) + delta).toString();
    return path.join('/');
  }

  clickSearchSuggestion(article) {
    const { page } = this.props.params;
    const path = `/articles/page/${page}/id/${article.id}`;
    browserHistory.push(path);
  }

  createListElement(article) {
    const { page } = this.props.params;
    let publishedDate;
    if (article.published_at) {
      publishedDate = moment(article.published_at).format('MMM DD, YYYY');
    } else {
      publishedDate = 'Unpublished';
    }
    return (
      <Link to={`/articles/page/${page}/id/${article.id}`} key={article.id}>
        <ListItem
          primaryText={article.title}
          secondaryText={
            <p>
              <span style={{ color: darkBlack }}>{publishedDate}</span>{' '}
              {article.teaser ? ' -- ' : null}
              {article.teaser}
            </p>
          }
          secondaryTextLines={2}
        />
      </Link>
    );
  }

  render() {
    if (this.state.ready) {
      // If trying to access inacessible page, redirect to page 1
      if (
        !this.state.data ||
        !this.state.data.articles ||
        !this.state.data.articles.byPage
      ) {
        return (
          <p>
            You have tried accessing a page that doesn{"'"}t exist. Please press
            <Link to="/articles/page/1">this link</Link> to return to page 1. If
            you believe this was unintended and there is an error with the
            website please contact the web development team of The Gazelle.
          </p>
        );
      }

      const { page } = this.props.params;
      const data = this.state.data.articles.byPage[NUM_ARTICLES_IN_PAGE][page];
      const { length } = this.state.data.articles;
      const maxPage = Math.ceil(length / NUM_ARTICLES_IN_PAGE);

      return (
        <div>
          <h1>Articles</h1>
          <Divider />
          <Paper style={styles.paper} zDepth={2}>
            <div style={styles.tabs}>
              <h2>Select an Article</h2>
              <Divider />
              <br />
              <SearchableArticlesWithPubDate
                handleClick={this.clickSearchSuggestion}
                length={3}
                fullWidth
              />
              <ArticleList
                elements={data}
                createElement={this.createListElement}
              />
              <RaisedButton
                label="Previous Page"
                primary
                style={styles.buttons}
                disabled={page <= 1}
                containerElement={<Link to={this.getNewPagePath(-1)} />}
              />
              <RaisedButton
                label="Next Page"
                primary
                style={styles.buttons}
                disabled={page >= maxPage}
                containerElement={<Link to={this.getNewPagePath(1)} />}
              />
            </div>
          </Paper>
          {this.props.children}
          <Link to={`/articles/page/${this.props.params.page}/new`}>
            <FloatingActionButton
              style={{ position: 'fixed', bottom: '50px', right: '100px' }}
            >
              <ContentAdd />
            </FloatingActionButton>
          </Link>
        </div>
      );
    }
    return (
      <div className="circular-progress">
        <CircularProgress />
        {this.props.children}
      </div>
    );
  }
}
