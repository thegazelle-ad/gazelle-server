// Render article preview data as all articles from respective issue
// Parents: AppController
// Children: ArticleList

import React from "react";
import _ from "lodash";
import FalcorController from 'lib/falcor/FalcorController';
import { Link } from "react-router";
import Helmet from "react-helmet"; // Add meta tags for pre-Ghost release
import { mapLegacyIssueSlugsToIssueNumber } from 'lib/utilities'

// Import components
import FeaturedArticle from "components/FeaturedArticle";
import EditorsPicks from "components/EditorsPicks";
import Trending from "components/Trending";
import ArticleList from "components/ArticleList";
import MailingListButton from "components/MailingListButton";
import NotFound from "components/NotFound";

export default class IssueController extends FalcorController {
  static getFalcorPathSets(params) {
    // URL Format: thegazelle.org/issue/:issueNumber/:articleCategory/:articleSlug

    // Conditional return allows The Gazelle to return the correct issue
    // User is either requesting the 'latestIssue' on the home page or an
    // old issue.
    if (params.issueNumber) { // If not on home page grab specificed issue
      const issueNumber = mapLegacyIssueSlugsToIssueNumber(params.issueNumber);
      return [
        ["issuesByNumber", issueNumber, ["issueNumber", "published_at"]],

        // Request the featured article
        ["issuesByNumber", issueNumber, "featured", ["title", "teaser", "issueNumber", "category", "slug", "image"]],
        ["issuesByNumber", issueNumber, "featured", "authors", {length: 10}, ["name", "slug"]],

        // Request first two Editor's Picks
        ["issuesByNumber", issueNumber, "picks", {length: 2}, ["title", "teaser", "issueNumber", "category", "slug", "image"]],
        ["issuesByNumber", issueNumber, "picks", {length: 2}, "authors", {length: 10}, ["name", "slug"]],

        // Request first five Trending articles
        ["trending", {length: 6}, ["title", "issueNumber", "category", "slug", "image"]],
        ["trending", {length: 6}, "authors", {length: 10}, ["name", "slug"]],

        // Request all category names and slugs (max 10 categories)
        ["issuesByNumber", issueNumber, "categories", {length: 10}, ["name", "slug"]],

        // Request necessary data from all articles from each category (max 30 articles)
        ["issuesByNumber", issueNumber, "categories", {length: 10}, "articles", {length: 30}, ["title", "teaser", "issueNumber", "category", "slug", "image"]],

        // Request author name and slug for each article (max 10 authors)
        ["issuesByNumber", issueNumber, "categories", {length: 10}, "articles", {length: 30}, "authors", {length: 10}, ["name", "slug"]],
      ];
    }
    else { // User is on home page
      return [
        ["latestIssue", ["issueNumber", "published_at"]],

        // Request the featured article
        ["latestIssue", "featured", ["title", "teaser", "issueNumber", "category", "slug", "image"]],
        ["latestIssue", "featured", "authors", {length: 10}, ["name", "slug"]],

        // Request first two Editor's Picks
        ["latestIssue", "picks", {length: 2}, ["title", "teaser", "issueNumber", "category", "slug", "image"]],
        ["latestIssue", "picks", {length: 2}, "authors", {length: 10}, ["name", "slug"]],

        // Request first five Trending articles
        ["trending", {length: 6}, ["title", "issueNumber", "category", "slug", "image"]],
        ["trending", {length: 6}, "authors", {length: 10}, ["name", "slug"]],

        // Request all category names and slugs (max 10 categories)
        ["latestIssue", "categories", {length: 10}, ["name", "slug"]],

        // Request necessary data from all articles from each category (max 30 articles)
        ["latestIssue", "categories", {length: 10}, "articles", {length: 30}, ["title", "teaser", "issueNumber", "category", "slug", "image"]],

        // Request author name and slug for each article (max 10 authors)
        ["latestIssue", "categories", {length: 10}, "articles", {length: 30}, "authors", {length: 10}, ["name", "slug"]],
      ];
    }
  }

  render () {
    if (this.state.ready) {
      if (!this.state.data || (this.props.params.issueNumber && !this.state.data.issuesByNumber)) {
        return (
          <NotFound />
        );
      } else {
        let issueData;
        if (!this.props.params.issueNumber) {
          issueData = this.state.data.latestIssue;
        } else {
          issueData = this.state.data.issuesByNumber[mapLegacyIssueSlugsToIssueNumber(this.props.params.issueNumber)];
        }
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
            return (
              <div key={category.name} className="issue__category">
                <Link to={"/category/" + category.slug}>
                  <h2 className="section-header">{category.name}</h2>
                </Link>
                <ArticleList articles={category.articles} />
              </div>
            );
          });

        // Make sure issueImage has a default
        const issueImage = issueData.featured.image || "https://thegazelle.s3.amazonaws.com/gazelle/2016/02/saadiyat-reflection.jpg";

        const meta = [
          // Search results
          {name: "description", content: "The Gazelle is a weekly student publication, serving the NYU Abu Dhabi community and the greater Global Network University at NYU."},

          // Social media
          {property: "og:title", content: "Issue " + issueData.issueNumber + " | The Gazelle"},
          {property: "og:type", content: "website"},
          {property: "og:url", content: "www.thegazelle.org"},
          {property: "og:image", content: issueImage},
          {property: "og:description", content: "The Gazelle is a weekly student publication serving the NYU Abu Dhabi community."},
        ];
        // Top level elements can't have classes or it will break transitions
        return (
          <div>
            <Helmet
              meta={meta}
              title={"The Gazelle | NYU Abu Dhabi News"}
            />
            <div className="issue">
              <FeaturedArticle article={issueData.featured} />
              <div className="top-articles">
                <EditorsPicks articles={issueData.picks} />
                <Trending articles={trendingData} />
              </div>
                {renderCategories}
              <MailingListButton />
            </div>
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

IssueController.propTypes = {
    issue: React.PropTypes.shape({
      published_at: React.PropTypes.string,
      articles: React.PropTypes.object,
    }),
}
