// Render article preview data as all articles from respective issue
// Parents: AppController
// Children: ArticleList

import React from "react";
import _ from "lodash";
import FalcorController from 'lib/falcor/FalcorController';
import { Link } from "react-router";
import Helmet from "react-helmet"; // Add meta tags for pre-Ghost relese

// Import components
import FeaturedArticle from "components/FeaturedArticle";
import EditorsPicks from "components/EditorsPicks";
import Trending from "components/Trending";
import ArticleList from "components/ArticleList";

export default class IssueController extends FalcorController {
  static getFalcorPathSets() {
    // URL Format: thegazelle.org/issue/:issueId/:articleCategory/:articleSlug

    // Multilevel request requires Falcor Path for each level of data requested
    // TODO: change hardcoded issueId
    return [
      ["issues", 76, ["pubDate"]],

      // Request the featured article
      ["issues", 76, "featured", ["title", "teaser", "issueId", "category", "slug", "featuredImage"]],
      ["issues", 76, "featured", "authors", {length: 10}, ["name", "slug"]],

      // Request first two Editor's Picks
      ["issues", 76, "picks", {length: 2}, ["title", "teaser", "issueId", "category", "slug", "featuredImage"]],
      ["issues", 76, "picks", {length: 2}, "authors", {length: 10}, ["name", "slug"]],

      // Request first five Trending articles
      ["trending", {length: 6}, ["title", "issueId", "category", "slug", "featuredImage"]],
      ["trending", {length: 6}, "authors", {length: 10}, ["name", "slug"]],

      // Request all category names and slugs (max 10 categories)
      ["issues", 76, "categories", {length: 10}, ["name", "slug"]],

      // Request necessary data from all articles from each category (max 30 articles)
      ["issues", 76, "categories", {length: 10}, "articles", {length: 30}, ["title", "teaser", "issueId", "category", "slug", "featuredImage"]],

      // Request author name and slug for each article (max 10 authors)
      ["issues", 76, "categories", {length: 10}, "articles", {length: 30}, "authors", {length: 10}, ["name", "slug"]],
    ];
  }

  render () {
    //console.log("RENDERING ISSUE CONTROLLER");
    if (this.state.ready) {
      // TODO: Remove hardcoded issueId
      let issueId = 76;
      const issueData = this.state.data.issues[issueId];
      const trendingData = this.state.data.trending;
      /*
       * Category object structure:
       * {
       *   name: "category name",
       *   slug: "category-slug",
       *   articles: {
       *     ...
       *   }
       * }
       */
      let renderCategories =
        // Render nothing if this.props.articles is empty
        _.map((issueData.categories || []), (category) => {
          //console.log(category);
          return (
            <div key={category.name} className="issue__category">
              <Link to={"/category/" + category.slug}>
                <h2 className="section-header">{category.name}</h2>
              </Link>
              <ArticleList articles={category.articles} />
            </div>
          );
        });

      const meta = [
        {property: "og:title", content: "The Gazelle"},
        {property: "og:type", content: "website"},
        {property: "og:url", content: "beta.thegazelle.org"},
        {property: "og:image", content: "https://www.thegazelle.org/wp-content/themes/gazelle/images/gazelle_logo.png"},
        {property: "og:description", content: "The Gazelle is a weekly student publication serving the NYU Abu Dhabi community."},
      ];
      // Top level elements can't have classes or it will break transitions
      return (
        <div>
          <Helmet meta={meta} />
          <div className="issue">
            <FeaturedArticle article={issueData.featured} />
            <div className="top-articles">
              <EditorsPicks articles={issueData.picks} />
              <Trending articles={trendingData} />
            </div>
            {renderCategories}
          </div>
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

IssueController.propTypes = {
    issue: React.PropTypes.shape({
      pubDate: React.PropTypes.string,
      articles: React.PropTypes.object,
    }),
    issueId: React.PropTypes.string,
}
