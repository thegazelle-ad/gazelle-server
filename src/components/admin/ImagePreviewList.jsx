import React from 'react';
import BaseComponent from 'lib/BaseComponent';

export default class ImagePreviewList extends BaseComponent {
  componentDidUpdate() {
    this.props.onChange();
  }

  render() {
    const { images } = this.props;
    if (images && images.length) {
      return <div className="imgPreviewList">{images}</div>;
    }
    return (
      <div className="imgPreviewList">
        <div className="previewText">
          Please select image(s) for preview
        </div>
      </div>
    );
  }
}

// .isRequired was removed here because of annoying behaviour
// with React.cloneElement which is needed with current modularized
// structure though.
ImagePreviewList.propTypes = {
  images: React.PropTypes.array,
  onChange: React.PropTypes.func,
};
