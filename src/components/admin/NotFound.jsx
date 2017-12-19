import React from 'react';
import BaseComponent from 'lib/BaseComponent';

export default class NotFound extends BaseComponent {
  render() {
    return (
      <div>
        <h2>404 page not found</h2>
        <p>The page you are looking for does not exist.</p>
      </div>
    );
  }
}
