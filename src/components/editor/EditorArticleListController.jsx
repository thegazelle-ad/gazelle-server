import React from 'react';
import { Link } from 'react-router';
import FalcorController from "lib/falcor/FalcorController";
import _ from "lodash";

const NUM_ARTICLES_IN_PAGE = 50;

export default class EditorArticleListController extends FalcorController {
  constructor(props) {
    super(props);
    this.getNewPagePath = this.getNewPagePath.bind(this);
    this.state = {
      slugSearchValue: "",
    };
  }
  static getFalcorPathSets(params) {
    return [['articlesByPage', NUM_ARTICLES_IN_PAGE, parseInt(params.page), {length: NUM_ARTICLES_IN_PAGE}, ['title', 'slug']], ['totalAmountOfArticles']];
  }

  getNewPagePath(delta) {
    let path = this.props.location.pathname;
    path = path.split('/');
    path[3] = (parseInt(path[3])+delta).toString();
    return path.join('/');
  }

  render() {
    let data, page, maxPage, length, slugSearchLink;
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

      slugSearchLink = "/articles/page/" + this.props.params.page + "/slug/" + this.state.slugSearchValue + "/";
    }
    // TODO: make the slug search be an autocomplete

    // TODO: Style it much better for small screens, add good responsiveness

    return (
      <div className="pure-g">
        <div className="pure-u-3-8">
          <h3>Articles</h3>
          <p>Here the 50 most recent articles are shown in the list, if you have an older article in mind,
          you can find the slug of it either in the Ghost editor, or in URL when you access the website on thegazelle.org
          and input it below</p>
          {!this.state.ready ?
            null :
            <form className="pure-form" onSubmit={(e)=>{e.preventDefault()}}>
              <input type="text" value={this.state.slugSearchValue} placeholder="Input Slug" onChange={(e) => {this.safeSetState({slugSearchValue: e.target.value})}} />
              <Link to={slugSearchLink} onClick={() => {this.safeSetState({slugSearchValue: ""})}}><button type="button" className={"pure-button" + (this.state.slugSearchValue ? "" : " pure-button-disabled")}>Submit</button></Link>
            </form>
          }
          {!this.state.ready ?
            <p>loading...</p> :
            <div style={{overflow: "auto", maxHeight:"50vh"}}>
              {
                _.map(data, (article) => {
                  // For Ling: I was kind of freestyling here, so don't have any idea whether this is good development style
                  // at all, if it is I guess this is an appropriate place to use <br> though right? As it's actually a line break.
                  // Otherwise, do you have any other ideas?
                  return <div key={article.slug}><Link to={"/articles/page/" + page + "/slug/"+article.slug}>{article.title}</Link><br /></div>;
                })
              }
            </div>
          }
          {!this.state.ready ?
            null :
            <div className="pure-g">
              <div className="pure-u-1-3">
                <Link to={this.getNewPagePath(-1)}><button type="button" className={"pure-button" + (page > 1 ? "" : " pure-button-disabled")} disabled={page <= 1}>Previous Page</button></Link>
              </div>
              <div className="pure-u-1-3">
                <div style={{padding: "0.5em"}}>
                  Page {page} of {maxPage}
                </div>
              </div>
              <div className="pure-u-1-3">
                <Link to={this.getNewPagePath(1)}><button type="button" className={"pure-button" + (page < maxPage ? "" : " pure-button-disabled")} disabled={page >= maxPage}>Next Page</button></Link>
              </div>
            </div>
          }
        </div>
        <div className="pure-u-1-8"></div>
        <div className="pure-u-1-2">
          {this.props.children}
        </div>
      </div>
    );
  }
}
