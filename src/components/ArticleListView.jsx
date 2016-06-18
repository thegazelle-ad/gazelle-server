import React from 'react';
import ArticlePreview from 'components/ArticlePreview';

export default class ArticleListView extends React.Component {
  getInitialState() {
    //getState()
  }

  componentDidMount() {
    //subscribes to store
  }

  componentWillUnmount() {
    //unsubscribes from store
  }

  onChange(state) {
    //setState(state)
  }

  render() {

    // Returns list of <ArticlePreview/> components with their respective posts
    // TODO: sort article previews by category
    // TODO: establish featured article, editor's picks, and trending sections
    var articles = this.state.articles.map(function(article){
      return (
        <ArticlePreview key={article.id} post={article} />
      );
    });

    return (
      <div>
        {articles}
      </div>
    );
  }
}
