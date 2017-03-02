import React from 'react';
import BaseComponent from 'lib/BaseComponent';

export default class EditorImagePreviewList extends BaseComponent {
  componentDidUpdate() {
    this.props.onChange();
  }

  render() {
    const { images } = this.props;
    if (images && images.length) {
      return <div className="imgPreviewList">{images}</div>;
    }
    else {
      return (
        <div className="imgPreviewList">
          <div className="previewText">
            Please select an image for preview
          </div>
        </div>
      );
    }
  }
}
