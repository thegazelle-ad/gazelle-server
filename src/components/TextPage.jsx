import React from 'react';

export default function TextPage(props) {
  return (
    <div className="text-page">
      <h2 className="text-page__title">{props.title}</h2>
      <div className="text-page__html" dangerouslySetInnerHTML={{__html: props.html}} />
    </div>
  );
}

TextPage.propTypes = {
  title: React.PropTypes.string,
  html: React.PropTypes.string,
}
