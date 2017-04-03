import React from 'react';
import { Link, browserHistory } from 'react-router';
import FalcorController from "lib/falcor/FalcorController";
import EditorSearchBar from 'components/editor/EditorSearchBar';
import EditorList from 'components/editor/EditorList';
import moment from 'moment';

// material-ui
import ListItem from 'material-ui/List/ListItem';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import {darkBlack} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';


const NUM_ARTICLES_IN_PAGE = 50;

export default class EditorArticleListController extends FalcorController {
  constructor(props) {
    super(props);
    this.getNewPagePath = this.getNewPagePath.bind(this);
    this.clickSearchSuggestion = this.clickSearchSuggestion.bind(this);
  }

  static getFalcorPathSets(params) {
    return [
      ['articlesByPage', NUM_ARTICLES_IN_PAGE, parseInt(params.page), {length: NUM_ARTICLES_IN_PAGE}, ['title', 'slug', 'teaser', 'published_at']],
      ['totalAmountOfArticles'],
    ];
  }

  getNewPagePath(delta) {
    let path = this.props.location.pathname;
    path = path.split('/');
    path[3] = (parseInt(path[3])+delta).toString();
    return path.join('/');
  }

  clickSearchSuggestion(article) {
    const page = this.props.params.page;
    const path = "/articles/page/" + page + "/slug/"+ article.slug;
    browserHistory.push(path);
  }

  createListElement(page, article) {
    return (
      <Link to={"/articles/page/" + page + "/slug/"+article.slug} key={article.slug}>
        <ListItem
          primaryText={article.title}
          secondaryText={
            <p>
              <span style={{color: darkBlack}}>
                {moment(article.published_at).format('MMM DD, YYYY')}
              </span> {" -- "}
              {article.teaser}
            </p>
          }
          secondaryTextLines={2}
        />
      </Link>
    );
  }

  render() {
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
    }

    let data, page, maxPage, length;
    if (this.state.ready) {
      // If trying to access inacessible page, redirect to page 1
      if (!this.state.data.articlesByPage) {
        return (
          <p>You have tried accessing a page that doesn't exist. Please press <Link to="/articles/page/1">this link</Link> to return to page 1.
          If you believe this was unintended and there is an error with the website please contact the web development team of The Gazelle.</p>
        );
      }

      page = this.props.params.page;
      data = this.state.data.articlesByPage[NUM_ARTICLES_IN_PAGE][page];
      length = this.state.data.totalAmountOfArticles;
      maxPage = Math.ceil(length/NUM_ARTICLES_IN_PAGE);
    }

    if (this.state.ready) {
      return (
        <div>
          <h1>Articles</h1>
          <Divider />
          <Paper style={styles.paper} zDepth={2}>
            <div style={styles.tabs}>
              <h2>Select an Article</h2>
              <Divider />
              <br />
              <EditorSearchBar
                model={this.props.model}
                mode="articles"
                handleClick={this.clickSearchSuggestion}
                length={3}
                fields={[]}
                showPubDate
              />
              {/* eslint-disable react/jsx-no-bind */}
              <EditorList
                elements={data}
                createElement={this.createListElement.bind(null, page)}
              />
              {/* eslint-enable react/jsx-no-bind */}
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
          <Paper style={styles.paper} zDepth={2}>
            {this.props.children}
          </Paper>
        </div>
      );
    }
    else {
      return (
        <div>
          <CircularProgress />
          {this.props.children}
        </div>
      );
    }
  }
}
