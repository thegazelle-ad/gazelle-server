import React from 'react';

export const gazelleRender = props => {
  const { children, mark } = props;
  switch (mark.type) {
    case 'bold':
      return <strong>{children}</strong>;
    case 'italic':
      return <em>{children}</em>;
    case 'title':
      return (
        <span
          style={{
            fontWeight: 'bold',
            fontSize: '2em',
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
