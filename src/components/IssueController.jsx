// Render article preview data as all articles from respective issue
// Parents: AppController
// Children: ArticleList

import React from "react";
import ArticleList from "components/ArticleList";
import FalcorController from 'lib/falcor/FalcorController';

export default class IssueController extends FalcorController {
  // TODO: Render top article
  // TODO: Render Editor's Picks and trending sections
  // TODO: Render categories
    // TODO: Render ArticleList of articles in each category
  //
  static getFalcorPath(params) {
    // URL Format: thegazelle.org/issue/:issueId/:articleCategory/:articleSlug

    // Multilevel request requires Falcor Path for each level of data requested
    return [
      ["issues", params.issueId, ["pubDate", "articles"]],
    ];
  }

  render () {
    return (
      <div>
        test
      </div>
    )
  }
}

IssueController.propTypes = {
    issue: React.PropTypes.shape({
      pubDate: React.PropTypes.string,
      articles: React.PropTypes.object,
    }),
    issueId: React.PropTypes.string.isRequired,
}
