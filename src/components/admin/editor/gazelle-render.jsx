import React from 'react';

export const gazelleRender = props => {
  const { children, mark } = props;
  switch (mark.type) {
    case 'italic':
      return <em>{children}</em>;
    case 'title':
      return (
        <span
          style={{
            fontWeight: 'bold',
            fontSize: '2.441em',
            margin: '1em 0 0.5em 0',
            display: 'inline-block',
          }}
        >
          {children}
        </span>
      );
    case 'url':
      return (
        <span
          style={{
            color: 'blue',
            textDecoration: 'underline',
          }}
        >
          {children}
        </span>
      );
    default:
      return children;
  }
};
