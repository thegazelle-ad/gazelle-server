import React from 'react';

export default class Author extends React.Component {

  render() {
    var currentAuthor = this.state.currentAuthor;
    return (
      <div>
        // TODO: establish static JSON object for authors
        // structure: {name, photo, biography, articleKeys=[]}
        <h1>{currentAuthor.name}</h1>
        <img src={currentAuthor.photo} alt="author" />
        <p>{currentAuthor.biography}</p>
        <div>
          // TODO: display all articles from author x
          // grab each article by key from server
        </div>
      </div>
    );
  }
}
