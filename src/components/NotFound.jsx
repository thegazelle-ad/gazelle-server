import React from 'react';

// "Dumb" component written as pure function
export default function NotFound() {
  return (
    <div className="not-found">
      <h2>404 page not found</h2>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}
