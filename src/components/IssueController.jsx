// Render article preview data as all articles from respective issue
// Parents: AppController
// Children: ArticleList

import React from "react";
import _ from "lodash";
import ArticleList from "components/ArticleList";
import FalcorController from 'lib/falcor/FalcorController';
import { Link } from 'react-router';

// Import components
import FeaturedArticle from "components/FeaturedArticle";
import EditorsPicks from "components/EditorsPicks";
import Trending from "components/Trending";

export default class IssueController extends FalcorController {
  // TODO: Render top article
  // TODO: Render Editor's Picks and trending sections
  // TODO: Render categories
    // TODO: Render ArticleList of articles in each category
  //
  static getFalcorPath(params) {
    // URL Format: thegazelle.org/issue/:issueId/:articleCategory/:articleSlug

    // Multilevel request requires Falcor Path for each level of data requested
    // TODO: change hardcoded issueId
    return [
      ["issues", 55, ["pubDate"]],

      // Request the featured article
      ["issues", 55, "featured", ["title", "teaser", "issueId", "category", "slug"]],
      ["issues", 55, "featured", "authors", {to: 10}, ["name", "slug"]],

      // Request first two Editor's Picks
      ["issues", 55, "picks", {to: 1}, ["title", "teaser", "issueId", "category", "slug"]],
      ["issues", 55, "picks", {to: 1}, "authors", {to: 10}, ["name", "slug"]],

      // Request first four Trending articles
      ["issues", 55, "trending", {to: 3}, ["title", "issueId", "category", "slug"]],
      ["issues", 55, "trending", {to: 3}, "authors", {to: 10}, ["name", "slug"]],

      // Request all remaining articles from issue
      ["issues", 55, "articles", ["off-campus", "on-campus", "commentary", "creative", "in-focus"], {to: 30}, ["title", "teaser", "issueId", "category", "slug"]],
      ["issues", 55, "articles", ["off-campus", "on-campus", "commentary", "creative", "in-focus"], {to: 30}, "authors", {to: 10}, ["name", "slug"]],
    ];
  }

  render () {
    console.log("RENDERING ISSUE CONTROLLER");

    if (this.state.ready) {
      // TODO: Remove hardcoded issueId
      let issueId = 55;
      const issueData = this.state.data.issues[issueId];
      console.log("Data: " + JSON.stringify(issueData.trending));

      let renderCategories =
        // Render nothing if this.props.articles is empty
        // articles = value; category = key
        _.map((issueData.articles || []), function(articles, category) {
          //console.log("Category: " + JSON.stringify(category));
          return(
            <div key={category} className="issue__category">
              <h2 className="section-header">{category}</h2>
              <div className="issue__category__list">
                <ArticleList articles={articles} />
              </div>
            </div>
          )
        });

      return (
        <div className="issue">
          {/*
            <div>Controller for issue: {issueId}</div>
            <div>Ready?: {this.state.ready ? 'true' : 'false'}</div>
            <div>Publication Date: {issueData.pubDate}</div>
          */}

          <FeaturedArticle article={issueData.featured} />
          <div className="top-articles">
            <EditorsPicks articles={issueData.picks} />
            <Trending articles={issueData.trending} />
          </div>
          {renderCategories}
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

IssueController.propTypes = {
    issue: React.PropTypes.shape({
      pubDate: React.PropTypes.string,
      articles: React.PropTypes.object,
    }),
    issueId: React.PropTypes.string,
}
