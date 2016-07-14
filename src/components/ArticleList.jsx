// Returns a list of article previews from articles array prop
// Parents: HomePage, Author
// Children: ArticlePreview

import React from 'react';
import ArticlePreview from 'components/ArticlePreview';

// TODO: create controller component to fetch list of articles in issue
export default class ArticleList extends React.Component {
  render() {

    // Returns list of <ArticlePreview/> components with their respective posts
    // TODO: sort article previews by category
    // TODO: establish featured article, editor's picks, and trending sections
    var renderArticles = () => {
      console.log("test");
      articles = this.props.articles;
      for (let article in articles) {
        if (category.hasOwnProperty(article)) {
          var a = articles[article];
          console.log("Article: " + a.title);
          return (
            <div>
              <br />
              <Link to={'/issue/' + a.issueId + '/' + a.category + '/' + a.slug}>
                {a.title}
              </Link>
              <p>{a.teaser}</p>
            </div>
          )
        }
      }
      // return (
      //   <ArticlePreview key={article.id} article={article} />
      // );
    };

    return (
      <div>
        {console.log("test")}
        {renderArticles()}
      </div>
    );
  }
}

// Formatted as list of objects
ArticleList.propTypes = {
  articles: React.PropTypes.object.isRequired,
}
