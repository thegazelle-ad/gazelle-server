import React from 'react';
import Article from 'components/Article';
import FalcorController from 'lib/falcor/FalcorController';

export default class ArticleController extends FalcorController {
  static getFalcorPath(params) {
    // Format: thegazelle.org/issue/:issueId/:articleCategory/:articleSlug
    return ["issues", params.issueId, "articles", params.articleCategory, params.articleSlug, ["title", "html"]];
  }

  render() {
    console.log("RENDERING ARTICLE CONTROLLER");
    if (this.state.ready) {
      const articleData = this.state.data.articles[this.props.params.articleSlug];
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
