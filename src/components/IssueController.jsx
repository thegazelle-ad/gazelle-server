// Render article preview data as all articles from respective issue
// Parents: AppController
// Children: ArticleList

import React from "react";
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
      ["issues", 55, "articles", ["opinion", "features", "news"], {to: 30}, ["title", "teaser", "issueId", "category", "slug"]],
    ];
  }

  render () {
    console.log("RENDERING ISSUE CONTROLLER");

    if (this.state.ready) {
      let issueId = 55;
      const issueData = this.state.data.issues[issueId];
      console.log("Data: " + JSON.stringify(issueData));

      var renderArticleLists = () => {
        var data = [];
        let categories = issueData.articles;
        console.log(categories);
        for (let category in categories) {
          if (categories.hasOwnProperty(category)) {
            console.log("Category: " + category);
            //console.log(categories[category]);
            data.push(
              <div key={category}>
                <h2>{category}</h2>
                <ArticleList articles={categories[category]} />
              </div>
            )
          }
        }
        return data;
      }

      return (
        <div>
          <div>Controller for issue: {issueId}</div>
          <div>Ready?: {this.state.ready ? 'true' : 'false'}</div>
          <div>Publication Date: {issueData.pubDate}</div>
          {renderArticleLists()}
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
