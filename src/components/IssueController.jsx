// Render article preview data as all articles from respective issue
// Parents: AppController
// Children: ArticleList

import React from "react";
import ArticleList from "components/ArticleList";

export default class IssueController extends React.Component {
  // Render top article
  // Render Editor's Picks and trending sections
  // Render categories
    // Render ArticleList of articles in each category
  //
  render () {
    return (
      <div>
        test
      </div>
    )
  }
}

IssueController.propTypes = {
    // article: React.PropTypes.shape({
    //   title: React.PropTypes.string.isRequired,
    //   image: React.PropTypes.string.isRequired,
    //   slug: React.PropTypes.string.isRequired,
    //   issueId: React.PropTypes.string.isRequired,
    //   category: React.PropTypes.string.isRequired,
    //   teaser: React.PropTypes.string.isRequired,
    //
    // }),
    // issueId: React.PropTypes.string.isRequired,
}
