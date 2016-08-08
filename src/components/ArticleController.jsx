import React from 'react';
import Article from 'components/Article';
import FalcorController from 'lib/falcor/FalcorController';

export default class ArticleController extends FalcorController {
  static getFalcorPathSets(params) {
    // URL Format: thegazelle.org/issue/:issueId/:articleCategory/:articleSlug

    // Multilevel request requires Falcor Path for each level of data requested
    return [
      ["articlesBySlug", params.articleSlug, ["title", "teaser", "html", "published_at", "issueId", "category", "slug"]],
      ["articlesBySlug", params.articleSlug, "authors", {from: 0, to: 5}, ["name", "slug"]],
    ];
  }

  render() {
    if (this.state.ready) {
      let articleSlug = this.props.params.articleSlug;
      // Access data fetched via Falcor
      const articleData = this.state.data.articlesBySlug[articleSlug];
      return (
        <div>
          <Article
            title={articleData.title}
            teaser={articleData.teaser}
            pubDate={articleData.published_at}
            html={articleData.html}
            authors={articleData.authors}
            url={"thegazelle.org/issue/" + articleData.issueId + '/' + articleData.category + '/' + articleData.slug}
          />
        </div>
      );
    } else {
      return (
        <div>
          Loading
        </div>
      );
    }
  }
}
