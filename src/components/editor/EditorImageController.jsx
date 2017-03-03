import React from 'react';
import BaseComponent from 'lib/BaseComponent';
import EditorImagePreview from './EditorImagePreview';
import _ from 'lodash';
import update from 'react-addons-update';
import { Link } from 'react-router';

const UPLOAD_URL = process.env.NODE_ENV ? (process.env.NODE_ENV === "production" ? "https://admin.thegazelle.org/upload" : "https://adminbeta.thegazelle.org/upload") : "http://localhost:4000/upload";

export default class EditorImageUploader extends BaseComponent {
  constructor() {
    super();
    this.safeSetState({
      files: [],
      changed: false,
      uploading: false,
    });
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.deleteImagePreview = this.deleteImagePreview.bind(this);
    this.addImagePreviewUrl = this.addImagePreviewUrl.bind(this);
    this.changeImageName = this.changeImageName.bind(this);
    this.handlePreviewChange = this.handlePreviewChange.bind(this);
    this.handleUploadTerminated = this.handleUploadTerminated.bind(this);
    this.postUploadReset = this.postUploadReset.bind(this);
  }

  handleUpload(e) {
    e.preventDefault();
    const mergeObject = {};
    this.state.files.forEach((fileObject, index) => {
      // Upload it
      this.uploadFile(fileObject);
      // Configure mergeObject to set it as loading
      mergeObject[index] = {
        meta_data: {$merge: {upload_status: 1}},
      };
    });
    const newFiles = update(this.state.files, mergeObject);
    this.safeSetState({
      uploading: true,
      files: newFiles,
    });
  }

  uploadFile(fileObject) {
    const file = fileObject.file;
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    xhr.onload = () => {
      const response = xhr.response;
      if (response.split(" ")[0] === "success") {
        const amazonURL = response.split(" ")[1];
        this.handleUploadTerminated(fileObject.meta_data.name, 2, amazonURL);
      }
      else {
        let errorMessage;
        if (response === "Error uploading") {
          errorMessage = "The server had an error while trying to upload the image to s3";
        }
        else if (response.split(",")[0] === "object already exists") {
          errorMessage = "An object already exists with the key: " + response.split(",")[1];
        }
        else {
          errorMessage = "An unexpected error occured: " + response;
        }
        this.handleUploadTerminated(fileObject.meta_data.name, 3, undefined, errorMessage);
      }
    };
    xhr.onerror = (err) => {
      // Set upload status to failed
      console.error(err); //eslint-disable-line no-console
      const error_message = "An unknown error occured contacting the server, error logged in developer console";
      this.handleUploadTerminated(fileObject.meta_data.name, 3, undefined, error_message);
    }
    xhr.open("POST", UPLOAD_URL, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    // Put file in request and assign user-defined name
    formData.set("image", file, fileObject.meta_data.name);
    // Send data
    xhr.send(formData);
  }

  handleUploadTerminated(fileName, upload_status, amazonURL, error_message) {
    const newChanged = this.state.files.some((storedFileObject) => {
      if (storedFileObject.meta_data.name === fileName) {
        return false;
      }
      const up_stat = storedFileObject.meta_data.upload_status;

      return !(up_stat === 2 || up_stat === 3);
    });
    const index = this.state.files.findIndex((storedFileObject) => {
      return storedFileObject.meta_data.name === fileName;
    });
    if (index !== -1) {
      const newFiles = update(this.state.files,
      {
        [index]: {
          meta_data: {
            $merge: {
              upload_status,
              amazonURL,
              error_message,
            },
          },
        },
      });
      this.safeSetState({
        files: newFiles,
        changed: newChanged,
      });
    }
    else {
      console.error("Unexpected error, couldn't find file"); //eslint-disable-line no-console
    }
    if (!newChanged) {
      this.safeSetState({
        changed: false,
      });
    }
  }

  handleInputChange(e) {
    e.preventDefault();
    const files = e.target.files;
    const fileArray = _.map(files, (file) => {
      return {
        file,
        meta_data: {name: file.name},
      };
    });
    let newFiles = this.state.files.concat(fileArray);
    newFiles = _.uniqBy(newFiles, (fileObject) => {
      return fileObject.meta_data.name;
    });
    this.safeSetState({
      files: newFiles,
    });

    fileArray.forEach((file) => {
      this.addImagePreviewUrl(file);
    });

    e.target.parentNode.reset();
  }

  handlePreviewChange() {
    if (this.state.uploading) {
      // Ignore this function if currently uploading
      return;
    }
    if (this.state.files && this.state.files.length && !this.state.changed) {
      this.safeSetState({
        changed: true,
      });
    }
    else if ((!this.state.files || this.state.files.length === 0) && this.state.changed) {
      this.safeSetState({
        changed: false,
      });
    }
  }

  deleteImagePreview(name) {
    const index = this.state.files.findIndex((fileObject) => {
      return fileObject.meta_data.name === name;
    });
    if (index !== -1) {
      const newFiles = update(this.state.files, {$splice: [[index, 1]]});
      this.safeSetState({
        files: newFiles,
      });
    }
  }

  addImagePreviewUrl(fileObject) {
    const reader = new FileReader();
    reader.onload = () => {
      const index = this.state.files.findIndex((storedFileObject) => {
        return storedFileObject.meta_data.name === fileObject.meta_data.name;
      });
      if (index !== -1) {
        const newFiles = update(this.state.files, {
          [index]: {
            meta_data: {$merge: {url: reader.result}},
          },
        });
        this.safeSetState({
          files: newFiles,
        });
      }
    };
    reader.onerror = (e) => {
      console.error(e); //eslint-disable-line no-console
    };

    reader.readAsDataURL(fileObject.file);
  }

  changeImageName(name) {
    const newName = window.prompt("Please enter new name (and remember to keep the extension) for " + name + ":");
    if (!newName) {
      return;
    }
    const index = this.state.files.findIndex((fileObject) => {
      return fileObject.meta_data.name === name;
    });
    if (index !== -1) {
      const newFiles = update(this.state.files, {
        [index]: {
          meta_data: {$merge: {name: newName}},
        },
      });
      this.safeSetState({
        files: newFiles,
      });
    }
  }

  postUploadReset() {
    this.safeSetState({
      files: [],
      uploading: false,
    });
  }

  render() {
    let changedStateMessage;
    const changedStateStyle = {};
    if (!this.state.changed) {
      if (!this.state.uploading) {
        changedStateMessage = "No Changes";
      }
      else {
        changedStateMessage = "Succesfully uploaded";
        changedStateStyle.color = "green";
      }
    }
    else {
      if (!this.state.uploading) {
        changedStateMessage = "Images awaiting upload";
        changedStateStyle.color = "red";
      }
      else {
        changedStateMessage = "Uploading";
        changedStateStyle.color = "#65e765";
      }
    }

    const imagePreviews = this.state.files ? this.state.files.map((fileObject) => {
      const { name, url, upload_status, amazonURL, error_message } = fileObject.meta_data;
      return (
        <EditorImagePreview
          url={url}
          name={name}
          upload_status={upload_status}
          key={name}
          onDelete={this.deleteImagePreview}
          onChangeName={this.changeImageName}
          amazonURL={amazonURL}
          error_message={error_message}
        />);
    }) : null;

    const isUpload = /upload\/?$/.test(window.location.pathname);

    return (
      <div className="pure-g" style={{flexGrow: "1"}}>
        <div className="pure-u-1-4">
          <h3>Images</h3>
          <ul>
            <li><Link activeClassName="active-link" to="/images/upload">Upload</Link></li>
            <li><Link activeClassName="active-link" to="/images/archive">Archive</Link></li>
          </ul>
          {isUpload ?
            <div>
              <h4 style={changedStateStyle}>{changedStateMessage}</h4>
              <form
                className="image-submit pure-form pure-form-stacked"
                onSubmit={this.handleUpload}
              >
                <input
                  type="file"
                  name="file-selector"
                  accept="image/*"
                  onChange={this.handleInputChange}
                  disabled={this.state.uploading}
                  multiple
                />
                <input
                  type="submit"
                  className="pure-button pure-button-primary"
                  value="Upload"
                  disabled={this.state.uploading || !this.state.changed}
                />
              </form>
              {this.state.uploading && !this.state.changed ?
                <button
                  type="button"
                  className="pure-button pure-button-primary"
                  onClick={this.postUploadReset}
                >Clear Upload</button>
              : null
              }
            </div>
          : null}
        </div>
        <div className="pure-u-3-4">
          {isUpload ?
            React.cloneElement(this.props.children,
            {
              images: imagePreviews,
              onChange: this.handlePreviewChange,
            })
          : this.props.children
          }
        </div>
      </div>
    );
  }
}
