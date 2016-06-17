import React from 'react';

export default class Author extends React.Component {
    // TODO: establish static JSON object for authors
    // structure: {name, photo, biography, articleKeys=[]}


    // TODO: establish static JSON object for authors
    // structure: {name, photo, biography, articleKeys=[]}
  render() {
    return (
      <div>
        <h1>{this.props.name}</h1>
        <p>{this.props.biography}</p>
      </div>
    );
  }
}
