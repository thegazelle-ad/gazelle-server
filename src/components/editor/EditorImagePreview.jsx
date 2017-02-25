import React from 'react';
import BaseComponent from 'lib/BaseComponent';

export default class EditorImagePreview extends BaseComponent {
  render() {
    const { url } = this.props;
    let component;
    if (url) {
      component = <img src={url} alt="upload preview" />;
    }
    else {
      component = (<div className="previewText">
        Please select an image for preview
      </div>);
    }
    return (
      <div className="imgPreview">
        {component}
      </div>
    );
  }
}
