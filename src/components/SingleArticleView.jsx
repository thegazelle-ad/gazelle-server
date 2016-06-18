import React from 'react';

export default class SingleArticleView extends React.Component {

  getInitialState() {
   // getState();
  }

  render() {
    var currentArticle = this.state.currentArticle;
    return (
      <div>
        <h1>{currentArticle.title}</h1>
        <div>
          <img
            src={currentArticle.author.photo}
            alt="author"
          />
          // TODO: ensure can handle multiple authors
          <span>{currentArticle.author.name}</span>
        </div>
        <div>
          {currentArticle.body}
        </div>
      </div>
    );
  }
}
