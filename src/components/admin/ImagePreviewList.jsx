import React from 'react';
import BaseComponent from 'lib/BaseComponent';

export default class ImagePreviewList extends BaseComponent {
  componentDidUpdate() {
    this.props.onChange();
  }

  render() {
    const styles = {
      imgList: {
        borderRight: 'none',
        borderLeft: 'none',
        borderTop: 'none',
        borderBottom: 'none',
        paddingBottom: '1rem',
        paddingTop: '1rem',
        background: '#eaf9ff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
      previewText: {
        color: 'rgba(0, 0, 0, 0.3)',
      },
    };
    const { images } = this.props;
    if (images && images.length) {
      return <div style={styles.imgList} className="imgPreviewList">{images}</div>;
    }
    return (
      <div style={styles.imgList} className="imgPreviewList">
        <div className="previewText" style={styles.previewText}>
          Your images will appear here.
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
