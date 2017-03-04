import React from 'react';
import BaseComponent from 'lib/BaseComponent';

/* upload_status prop is encoded as such:
  1: Upload in progress,
  2: Upload complete,
  3: Upload error / failed,
  else: No upload attempted yet
  */
export default class EditorImagePreview extends BaseComponent {
  constructor() {
    super();
    this.onDelete = this.onDelete.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
  }

  onDelete() {
    this.props.onDelete(this.props.name);
  }

  onChangeName() {
    this.props.onChangeName(this.props.name);
  }

  render() {
    const { url, name, upload_status, amazonURL, error_message } = this.props;
    let uploading_component;
    if (upload_status === 1) {
      uploading_component = <div>Uploading...</div>;
    }
    else if (upload_status === 2) {
      uploading_component = <div>Upload Complete</div>;
    }
    else if (upload_status === 3) {
      uploading_component = <div>Upload Failed</div>;
    }
    else {
      uploading_component = null;
    }

    let messageComponent;
    if (amazonURL) {
      messageComponent = <div className="previewURL">URL: {amazonURL}</div>;
    }
    else if (error_message) {
      messageComponent = <div className="preview_error">Error: {error_message}</div>;
    }
    else {
      messageComponent = null;
    }

    let component;
    if (url) {
      component = (
        <div className="imagePreview">
          <img alt={"preview of " + name} src={url} />
          <br />
          {name}
          <br />
          <button type="button" onClick={this.onDelete}>Delete</button>
          <br />
          <button type="button" onClick={this.onChangeName}>Change name</button>
          <br />
          {uploading_component}
          {messageComponent}
        </div>
      );
    }
    else {
      component = (
        <div className="imagePreview">
          <div className="imagePreviewLoading">
            Loading...<button type="button" onClick={this.onDelete}>Delete</button>
            <br />
            <button type="button" onClick={this.onChangeName}>Change name></button>
          </div>
          {name}
          <br />
          {uploading_component}
          {messageComponent}
        </div>
      );
    }
      
    return component;
  }
}

EditorImagePreview.propTypes = {
  url: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  upload_status: React.PropTypes.number,
  amazonURL: React.PropTypes.string,
  error_message: React.PropTypes.string,
  onDelete: React.PropTypes.func.isRequired,
  onChangeName: React.PropTypes.func.isRequired,
};
