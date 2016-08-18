// Render article preview data as all articles from respective issue
// Parents: AppController
// Children: ArticleList

import React from "react";
import _ from "lodash";
import FalcorController from 'lib/falcor/FalcorController';
import { Link } from "react-router";

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
      ["issues", 55, ["pubDate"]],

      // Request the featured article
      ["issues", 55, "featured", ["title", "teaser", "issueId", "category", "slug", "featuredImage"]],
      ["issues", 55, "featured", "authors", {length: 10}, ["name", "slug"]],

      // Request first two Editor's Picks
      ["issues", 55, "picks", {length: 2}, ["title", "teaser", "issueId", "category", "slug", "featuredImage"]],
      ["issues", 55, "picks", {length: 2}, "authors", {length: 10}, ["name", "slug"]],

      // Request first five Trending articles
      ["trending", {length: 5}, ["title", "issueId", "category", "slug", "featuredImage"]],
      ["trending", {length: 5}, "authors", {length: 10}, ["name", "slug"]],

      // Request all category names and slugs (max 10 categories)
      ["issues", 55, "categories", {length: 10}, ["name", "slug"]],

      // Request necessary data from all articles from each category (max 30 articles)
      ["issues", 55, "categories", {length: 10}, "articles", {length: 30}, ["title", "teaser", "issueId", "category", "slug", "featuredImage"]],

      // Request author name and slug for each article (max 10 authors)
      ["issues", 55, "categories", {length: 10}, "articles", {length: 30}, "authors", {length: 10}, ["name", "slug"]],
    ];
  }

  render () {
    //console.log("RENDERING ISSUE CONTROLLER");
    if (this.state.ready) {
      // TODO: Remove hardcoded issueId
      let issueId = 55;
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

      // Top level elements can't have classes or it will break transitions
      return (
        <div>
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
