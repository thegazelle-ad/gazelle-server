import React from 'react';
import { Link, browserHistory } from 'react-router';
import FalcorController from "lib/falcor/FalcorController";
import EditorSearchBar from 'components/editor/EditorSearchBar';
import EditorList from 'components/editor/EditorList';

const NUM_ARTICLES_IN_PAGE = 50;

export default class EditorArticleListController extends FalcorController {
  constructor(props) {
    super(props);
    this.getNewPagePath = this.getNewPagePath.bind(this);
    this.clickSearchSuggestion = this.clickSearchSuggestion.bind(this);
  }

  static getFalcorPathSets(params) {
    return [
      ['articlesByPage', NUM_ARTICLES_IN_PAGE, parseInt(params.page), {length: NUM_ARTICLES_IN_PAGE}, ['title', 'slug']],
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
      <div key={article.slug}>
        <Link to={"/articles/page/" + page + "/slug/"+article.slug} activeClassName="active-link">{article.title}</Link>
      </div>
    );
  }

  render() {
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

    // TODO: Style it much better for small screens, add good responsiveness

    if (this.state.ready) {
      return (
        <div className="pure-g">
          <div className="pure-u-3-8">
            <h3>Articles</h3>
            <p>Here the 50 most recent articles are shown in the list, if you have an older article in mind,
            you can search for it here by entering the title of the article</p>
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
              maxHeight="50vh"
            />
            {/* eslint-enable react/jsx-no-bind */}
            <div className="pure-g">
              <div className="pure-u-1-3">
                <Link to={this.getNewPagePath(-1)}><button type="button" className="pure-button" disabled={page <= 1}>Previous Page</button></Link>
              </div>
              <div className="pure-u-1-3">
                <div style={{padding: "0.5em"}}>
                  Page {page} of {maxPage}
                </div>
              </div>
              <div className="pure-u-1-3">
                <Link to={this.getNewPagePath(1)}><button type="button" className="pure-button" disabled={page >= maxPage}>Next Page</button></Link>
              </div>
            </div>
          </div>
          <div className="pure-u-1-8"></div>
          <div className="pure-u-1-2">
            {this.props.children}
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="pure-g">
          <div className="pure-u-3-8">
            <h3>Articles</h3>
            <p>Here the 50 most recent articles are shown in the list, if you have an older article in mind,
            you can search for it here by entering the title of the article</p>
            <p>loading...</p>
          </div>
          <div className="pure-u-1-8"></div>
          <div className="pure-u-1-2">
            {this.props.children}
          </div>
        </div>
      );
    }
  }
}
