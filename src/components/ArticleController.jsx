import React from 'react';
import Article from 'components/Article';
import FalcorController from 'lib/falcor/FalcorController';

export default class ArticleController extends FalcorController {
  static getFalcorPath(params) {
    // Format: thegazelle.org/issue/:issueId/:articleCategory/:articleSlug
    return ["issues", params.issueId, "articles", params.articleCategory, params.articleSlug, ["title", "html", "authors", [{"from": 0, "to": 10}, "name", "slug"]]];
  }

  render() {
    console.log("RENDERING ARTICLE CONTROLLER");
    if (this.state.ready) {
      let issueId = this.props.params.issueId;
      let articleCategory = this.props.params.articleCategory;
      let articleSlug = this.props.params.articleSlug;
      // Access data fetched via Falcor
      const articleData = this.state.data.issues[issueId]["articles"][articleCategory][articleSlug];
      console.log("Authors: " + articleData.authors);
      return (
        <div>
          <div>Controller for article: {articleData.title}</div>
          <div>Ready?: {this.state.ready ? 'true' : 'false'}</div>
          <Article
            title={articleData.title}
            html={articleData.html}
          />
        </div>
      );
    } else {
      return (
        <div>
          <h1>Loading</h1>
        </div>
      );
    }
  }
}
