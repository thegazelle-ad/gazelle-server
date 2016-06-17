import React from 'react';

export default class Article extends React.Component {
  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <div>
        </div>
        <div>
          {this.props.body}
        </div>
      </div>
    );
  }
}
