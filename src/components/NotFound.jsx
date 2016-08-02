import React from 'react';
import BaseComponent from 'lib/BaseComponent';

// "Dumb" component written as pure function
export default class NotFound extends BaseComponent {
  render() {
    return (
      <div className="not-found">
        <h2>404 page not found</h2>
        <p>The page you are looking for does not exist.</p>
      </div>
    );
  }
}
