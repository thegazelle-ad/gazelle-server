import React from 'react';
import ArticlePreview from 'components/ArticlePreview';

// TODO: create controller component to fetch list of articles in issue
export default class ArticleList extends React.Component {
  render() {

    // Returns list of <ArticlePreview/> components with their respective posts
    // TODO: sort article previews by category
    // TODO: establish featured article, editor's picks, and trending sections
    var articles = this.state.articles.map(function(article){
      return (
        <ArticlePreview key={article.id} article={article} />
      );
    });

    return (
      <div>
        {articles}
      </div>
    );
  }
}
