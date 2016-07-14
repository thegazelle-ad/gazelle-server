import React from 'react';
import Article from 'components/Article';
import FalcorController from 'lib/falcor/FalcorController';

export default class ArticleController extends FalcorController {
  static getFalcorPath(params) {
    // URL Format: thegazelle.org/issue/:issueId/:articleCategory/:articleSlug

    // Multilevel request requires Falcor Path for each level of data requested
    return [
      ["articlesBySlug", params.articleSlug, ["title", "html"]],
      ["articlesBySlug", params.articleSlug, "authors", {from: 0, to: 5}, ["name", "slug"]],
    ];
  }

  render() {
    console.log("RENDERING ARTICLE CONTROLLER");
    if (this.state.ready) {
      let articleSlug = this.props.params.articleSlug;
      // Access data fetched via Falcor
      const articleData = this.state.data.articlesBySlug[articleSlug];
      console.log("Data: " + JSON.stringify(articleData.authors));
      return (
        <div>
          <div>Controller for article: {articleData.title}</div>
          <div>Ready?: {this.state.ready ? 'true' : 'false'}</div>
          <Article
            title={articleData.title}
            html={articleData.html}
            authors={articleData.authors}
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
