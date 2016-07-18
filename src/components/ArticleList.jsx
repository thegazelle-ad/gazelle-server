// Returns a list of article previews from articles array prop
// Parents: HomePage, Author
// Children: ArticlePreview

import React from 'react';
import ArticlePreview from 'components/ArticlePreview';

import { Link } from 'react-router';

// TODO: create controller component to fetch list of articles in issue
export default class ArticleList extends React.Component {
  render() {

    // Returns list of <ArticlePreview/> components with their respective posts
    // TODO: sort article previews by category
    // TODO: establish featured article, editor's picks, and trending sections

    var renderArticlePreviews = () => {
      var data = [];
      let articles = this.props.articles;
      for (let article in articles) {
        if (articles.hasOwnProperty(article)) {
          var a = articles[article];
          console.log("Article: " + a.title);
          data.push(
            <div>
              <ArticlePreview article = {articles[article]} />
            </div>
          )
        }
      }
      return data;
    }

    return (
      <div>
        {renderArticlePreviews()}
      </div>
    );
  }
}

// Formatted as list of objects
ArticleList.propTypes = {
  articles: React.PropTypes.object.isRequired,
}
