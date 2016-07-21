// Render article preview data as all articles from respective issue
// Parents: AppController
// Children: ArticleList

import React from "react";
import _ from "lodash";
import ArticleList from "components/ArticleList";
import FalcorController from 'lib/falcor/FalcorController';
import { Link } from 'react-router';

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
      ["issues", 55, "articles", ["off-campus", "on-campus", "commentary", "creative", "in-focus"], {to: 30}, ["title", "teaser", "issueId", "category", "slug"]],
    ];
  }

  render () {
    console.log("RENDERING ISSUE CONTROLLER");

    if (this.state.ready) {
      // TODO: Remove hardcoded issueId
      let issueId = 55;
      const issueData = this.state.data.issues[issueId];
      console.log("Data: " + JSON.stringify(issueData));

      let renderCategories =
        // Render nothing if this.props.articles is empty
        // articles = value; category = key
        _.map((issueData.articles || []), function(articles, category) {
          console.log("Category: " + JSON.stringify(category));
          return(
            <div key={category}>
              <h2>{category}</h2>
              <ArticleList articles={articles} />
            </div>
          )
        });

      return (
        <div>
          {/*
            <div>Controller for issue: {issueId}</div>
            <div>Ready?: {this.state.ready ? 'true' : 'false'}</div>
            <div>Publication Date: {issueData.pubDate}</div>
          */}
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
