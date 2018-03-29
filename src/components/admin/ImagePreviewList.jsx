import React from 'react';
import BaseComponent from 'lib/BaseComponent';

export default class ImagePreviewList extends BaseComponent {
  componentDidUpdate() {
    this.props.onChange();
  }

  render() {
    const { imageUrls } = this.props;
    if (imageUrls && imageUrls.length) {
      return <div className="imgPreviewList">{imageUrls}</div>;
    }
    return (
      <div className="imgPreviewList">
        <div className="previewText">Please select image(s) for preview</div>
      </div>
    );
  }
}

// .isRequired was removed here because of annoying behaviour
// with React.cloneElement which is needed with current modularized
// structure though.
ImagePreviewList.propTypes = {
  imageUrls: React.PropTypes.arrayOf(React.PropTypes.element),
  onChange: React.PropTypes.func,
};
