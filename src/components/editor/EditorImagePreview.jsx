import React from 'react';
import BaseComponent from 'lib/BaseComponent';

/* uploadStatus prop is encoded as such:
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
    this.onCopyToClipboard = this.onCopyToClipboard.bind(this);
  }

  onDelete() {
    this.props.onDelete(this.props.name);
  }

  onChangeName() {
    this.props.onChangeName(this.props.name);
  }

  onCopyToClipboard() {
    var textField = document.createElement("textarea");
    textField.innerText = this.props.amazonURL;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  }

  render() {
    const { url, name, uploadStatus, amazonURL, errorMessage } = this.props;
    let uploadingComponent;
    if (uploadStatus === 1) {
      uploadingComponent = <div>Uploading...</div>;
    } else if (uploadStatus === 2) {
      uploadingComponent = <div>Upload Complete</div>;
    } else if (uploadStatus === 3) {
      uploadingComponent = <div>Upload Failed</div>;
    } else {
      uploadingComponent = null;
    }

    let messageComponent;
    let copyComponent = null;
    if (amazonURL) {
      messageComponent = <div className="previewURL">URL: {amazonURL}</div>;
      if (document.queryCommandSupported("copy")) {
        copyComponent = <button type='button' onClick={this.onCopyToClipboard}>Copy link</button>;
      } else {
        // TODO: After Material-UI is merged in we change this to a Material-UI Dialog or something similar
        copyComponent = <div>It seems that our copy button is not compatible with your web browser. Please upgrade to the newest version for full Gazelle capabilities.</div>
      }
    } else if (error_message) {
      messageComponent = <div className="preview_error">Error: {error_message}</div>;
    } else {
      messageComponent = null;
    }

    let component;
    if (url) {
      component = (
        <div className="imagePreview">
          <img alt={'preview of ' + name} src={url} />
          <br />
          {name}
          <br />
          <button type="button" onClick={this.onDelete}>Delete</button>
          <br />
          <button type="button" onClick={this.onChangeName}>Change name</button>
          <br />
          {uploadingComponent}
          {messageComponent}
          {copyComponent}
        </div>
      );
    } else {
      component = (
        <div className="imagePreview">
          <div className="imagePreviewLoading">
            Loading...<button type="button" onClick={this.onDelete}>Delete</button>
            <br />
            <button type="button" onClick={this.onChangeName}>Change name></button>
          </div>
          {name}
          <br />
          {uploadingComponent}
          {messageComponent}
          {copyComponent}
        </div>
      );
    }

    return component;
  }
}

EditorImagePreview.propTypes = {
  url: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  uploadStatus: React.PropTypes.number,
  amazonURL: React.PropTypes.string,
  errorMessage: React.PropTypes.string,
  onDelete: React.PropTypes.func.isRequired,
  onChangeName: React.PropTypes.func.isRequired,
};
