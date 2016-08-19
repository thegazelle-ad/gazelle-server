import React from 'react';
import Article from 'components/Article';
import FalcorController from 'lib/falcor/FalcorController';

export default class ArticleController extends FalcorController {
  static getFalcorPathSets(params) {
    // URL Format: thegazelle.org/issue/:issueId/:articleCategory/:articleSlug

    // Multilevel request requires Falcor Path for each level of data requested
    return [
      // Fetch article data
      ["articlesBySlug", params.articleSlug, ["title", "teaser", "html", "published_at", "issueId", "category", "slug", "featuredImage"]],
      ["articlesBySlug", params.articleSlug, "authors", {length: 10}, ["name", "slug"]],

      // Fetch two related articles
      // TODO: convert fetching by category to fetching by tag
      ["articlesBySlug", params.articleSlug, "related", {length: 2}, ["title", "teaser", "featuredImage", "issueId", "category", "slug"]],
      ["articlesBySlug", params.articleSlug, "related", {length: 2},  "authors", {length: 10}, ["name", "slug"]],

      // Fetch first five Trending articles
      ["trending", {length: 7}, ["title", "issueId", "category", "slug", "featuredImage"]],
      ["trending", {length: 7}, "authors", {length: 10}, ["name", "slug"]],

    ];
  }

  render() {
    if (this.state.ready) {
      let articleSlug = this.props.params.articleSlug;
      // Access data fetched via Falcor
      const articleData = this.state.data.articlesBySlug[articleSlug];
      const trendingData = this.state.data.trending;
      const relatedArticlesData = articleData.related;
      return (
        <div>
          <Article
            title={articleData.title}
            teaser={articleData.teaser}
            pubDate={articleData.published_at}
            html={articleData.html}
            authors={articleData.authors}
            featuredImage={articleData.featuredImage}
            url={"thegazelle.org/issue/" + articleData.issueId + '/' + articleData.category + '/' + articleData.slug}
            trending={trendingData}
            relatedArticles={relatedArticlesData}
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
