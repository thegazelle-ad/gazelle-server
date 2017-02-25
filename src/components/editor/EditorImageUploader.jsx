import React from 'react';
import BaseComponent from 'lib/BaseComponent';
import EditorImagePreview from './EditorImagePreview';

const UPLOAD_URL = process.env.NODE_ENV ? (process.env.NODE_ENV === "production" ? "https://admin.thegazelle.org/upload" : "https://adminbeta.thegazelle.org/upload") : "http://localhost:4000/upload";

export default class EditorImageUploader extends BaseComponent {
  constructor() {
    super();
    this.safeSetState({
      previewURL: null,
      lastUploadedURL: null,
      changed: false,
      uploading: false,
    });
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const file = e.target["file-uploader"].files[0];
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    xhr.onload = () => {
      const response = xhr.response;
      if (response.split(" ")[0] === "success") {
        this.safeSetState({
          changed: false,
          lastUploadedURL: response.split(" ")[1],
        });
        setTimeout(() => {
          this.safeSetState({
            uploading: false,
          });
        }, 2000);
      }
      else {
        this.safeSetState({
          changed: false,
          uploading: false,
        });
        if (response === "Error uploading") {
          window.alert("The server had an error while trying to upload the image to s3");
        }
        else if (response.split(",")[0] === "object already exists") {
          window.alert("An object already exists with the key: " + response.split(",")[1]);
        }
        else {
          window.alert("An unexpected error occured: " + response);
        }
      }
    };
    xhr.onerror = (err) => {
      this.safeSetState({
        uploading: false,
        changed: false,
      });
      window.alert("Unexpected error occured: " + err);
    }
    xhr.open("POST", UPLOAD_URL, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    formData.set("image", file, file.name);
    this.safeSetState({
      uploading: true,
      lastUploadedURL: null,
    });
    e.target.reset();
    xhr.send(formData);
  }

  handleImageChange(e) {
    const file = e.target.files[0];
    if (file && !this.state.changed) {
      this.safeSetState({
        changed: true,
      });
    }
    else if (!file && this.state.changed) {
      this.safeSetState({
        changed: false,
      });
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.safeSetState({
        previewURL: reader.result,
      });
    };
    reader.onerror = (e) => {
      console.error(e); //eslint-disable-line no-console
    };

    reader.readAsDataURL(file);
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
        changedStateMessage = "No Changes";
      }
      else {
        changedStateMessage = "Uploading";
        changedStateStyle.color = "#65e765";
      }
    }
    return (
      <div className="pure-g">
        <div className="pure-u-1-4">
          <h3>Image Uploader</h3>
          <h4 style={changedStateStyle}>{changedStateMessage}</h4>
          <form className="image-submit pure-form pure-form-stacked" onSubmit={this.handleSubmit}>
            <input type="file" name="file-uploader" accept="image/*" onChange={this.handleImageChange} />
            <input type="submit" className="pure-button pure-button-primary" value="Upload" disabled={this.state.uploading || !this.state.changed} />
          </form>
          {this.state.lastUploadedURL ?
            <div style={{marginTop: "20px"}}>
              <h4>URL</h4>
                {this.state.lastUploadedURL}
            </div> :
            null
          }
        </div>
        <div className="pure-u-1-8"></div>
        <div className="pure-u-5-8">
          <EditorImagePreview url={this.state.previewURL} />  
        </div>
      </div>
    );
  }
}
