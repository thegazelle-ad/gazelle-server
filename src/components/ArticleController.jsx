import React from 'react';
import Helmet from 'react-helmet'; // Add <head> data

// Components
import Article from 'components/Article';
import FalcorController from 'lib/falcor/FalcorController';
import NotFound from 'components/NotFound';

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
      if (this.state.data == null) {
        return (
          <NotFound />
        );
      } else {
        let articleSlug = this.props.params.articleSlug;
        // Access data fetched via Falcor
        const articleData = this.state.data.articlesBySlug[articleSlug];
        const trendingData = this.state.data.trending;
        const relatedArticlesData = articleData.related;
        const meta = [
          // Search results
          {name: "description", content: this.props.teaser},

          // Social media sharing
          {property: "og:title", content: articleData.title + " | The Gazelle"},
          {property: "og:type", content: "article"},
          {property: "og:url", content: "beta.thegazelle.org/issue/" + articleData.issueId + '/' + articleData.category + '/' + articleData.slug},
          {property: "og:image", content: "https:" + articleData.featuredImage},
          {property: "og:description", content: articleData.teaser},
          {property: "og:site_name", content: "The Gazelle"},
        ];
        return (
          <div>
            <Helmet
              meta={meta}
              title={articleData.title + " | The Gazelle"}
            />
            <Article
              title={articleData.title}
              teaser={articleData.teaser}
              pubDate={articleData.published_at}
              html={articleData.html}
              authors={articleData.authors}
              featuredImage={articleData.featuredImage}
              url={"beta.thegazelle.org/issue/" + articleData.issueId + '/' + articleData.category + '/' + articleData.slug}
              trending={trendingData}
              relatedArticles={relatedArticlesData}
            />
          </div>
        );
      }
    } else {
      return (
        <div>
          Loading
        </div>
      );
    }
  }
}
