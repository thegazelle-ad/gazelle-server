import React from 'react';
import BaseComponent from 'lib/BaseComponent';
import ImagePreview from './ImagePreview';
import _ from 'lodash';
import update from 'react-addons-update';
import { Link } from 'react-router';
import { updateFieldValue } from 'components/admin/lib/form-field-updaters';

// material-ui
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import { Tabs, Tab } from 'material-ui/Tabs';
import FileUpload from 'material-ui/svg-icons/file/file-upload';
import Folder from 'material-ui/svg-icons/file/folder';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';

export default class ImageUploader extends BaseComponent {
  constructor() {
    super();
    this.safeSetState({
      files: [],
      changed: false,
      uploading: false,
      changeNameOpen: false,
      nameInput: '',
      imgName: '',
      wrongExtension: false,
      attemptedExt: '',
      fullWidthTextField: true,
    });
    this.fieldUpdaters = {
      nameInput: updateFieldValue.bind(this, 'nameInput', undefined),
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.deleteImagePreview = this.deleteImagePreview.bind(this);
    this.addImagePreviewUrl = this.addImagePreviewUrl.bind(this);
    this.changeImageName = this.changeImageName.bind(this);
    this.changeImageNameClose = this.changeImageNameClose.bind(this);
    this.changeImageNameOpen = this.changeImageNameOpen.bind(this);
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
        metaData: { $merge: { uploadStatus: 1 } },
      };
    });
    const newFiles = update(this.state.files, mergeObject);
    this.safeSetState({
      uploading: true,
      files: newFiles,
    });
  }

  handleSnackbarClose() {
    this.safeSetState({ wrongExtension: false });
  }

  uploadFile(fileObject) {
    const file = fileObject.file;
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    xhr.onload = () => {
      const response = xhr.response;
      if (response.split(' ')[0] === 'success') {
        const URL = response.split(' ')[1];
        this.handleUploadTerminated(fileObject.metaData.name, 2, URL);
      } else {
        let errorMessage;
        if (response === 'Error uploading') {
          errorMessage = 'The server had an error while trying to upload the image to s3';
        } else if (response.split(',')[0] === 'object already exists') {
          errorMessage = `An object already exists with the key: ${response.split(',')[1]}`;
        } else {
          errorMessage = `An unexpected error occured: ${response}`;
        }
        this.handleUploadTerminated(fileObject.metaData.name, 3, undefined, errorMessage);
      }
    };
    xhr.onerror = (err) => {
      // Set upload status to failed
      console.error(err); // eslint-disable-line no-console
      const errorMessage = 'An unknown error occured contacting the server, ' +
                           'error logged in developer console';
      this.handleUploadTerminated(fileObject.metaData.name, 3, undefined, errorMessage);
    };
    xhr.open('POST', '/upload', true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    // Put file in request and assign user-defined name
    formData.set('image', file, fileObject.metaData.name);
    // Send data
    xhr.send(formData);
  }

  handleUploadTerminated(fileName, uploadStatus, amazonURL, errorMessage) {
    const newChanged = this.state.files.some((storedFileObject) => {
      if (storedFileObject.metaData.name === fileName) {
        return false;
      }
      const upStat = storedFileObject.metaData.uploadStatus;

      return !(upStat === 2 || upStat === 3);
    });
    const index = this.state.files.findIndex(
      storedFileObject => storedFileObject.metaData.name === fileName
    );
    if (index !== -1) {
      const newFiles = update(this.state.files,
        {
          [index]: {
            metaData: {
              $merge: {
                uploadStatus,
                amazonURL,
                errorMessage,
              },
            },
          },
        });
      this.safeSetState({
        files: newFiles,
        changed: newChanged,
      });
    } else {
      console.error("Unexpected error, couldn't find file"); // eslint-disable-line no-console
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
    const fileArray = _.map(files, file => ({ file, metaData: { name: file.name } }));
    let newFiles = this.state.files.concat(fileArray);
    newFiles = _.uniqBy(newFiles, fileObject => fileObject.metaData.name);
    this.safeSetState({
      files: newFiles,
    });

    fileArray.forEach((file) => {
      this.addImagePreviewUrl(file);
    });

    // Reset to "No Files Chosen" in the input element instead of saying "10 files" or so
    e.target.parentNode.parentNode.parentNode.parentNode.parentNode.reset();
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
    } else if ((!this.state.files || this.state.files.length === 0) && this.state.changed) {
      this.safeSetState({
        changed: false,
      });
    }
  }

  deleteImagePreview(name) {
    const index = this.state.files.findIndex(fileObject => fileObject.metaData.name === name);
    if (index !== -1) {
      const newFiles = update(this.state.files, { $splice: [[index, 1]] });
      this.safeSetState({
        files: newFiles,
      });
    }
  }

  addImagePreviewUrl(fileObject) {
    const reader = new FileReader();
    reader.onload = () => {
      const index = this.state.files.findIndex(
        storedFileObject => storedFileObject.metaData.name === fileObject.metaData.name
      );
      if (index !== -1) {
        const newFiles = update(this.state.files, {
          [index]: {
            metaData: { $merge: { url: reader.result } },
          },
        });
        this.safeSetState({
          files: newFiles,
        });
      }
    };
    reader.onerror = (e) => {
      console.error(e); // eslint-disable-line no-console
    };

    reader.readAsDataURL(fileObject.file);
  }

  changeImageNameOpen(name) {
    this.safeSetState({
      changeNameOpen: true,
      wrongExtension: false,
      imgName: name,
      nameInput: name,
    });
  }

  changeImageName(e) {
    e.preventDefault();
    const imgName = this.state.imgName;
    const re = /(?:\.([^.]+))?$/;
    const oldExt = re.exec(imgName)[1];
    const nameInput = this.state.nameInput;
    const newExt = nameInput.lastIndexOf('.') !== -1 ? re.exec(nameInput)[1] : undefined;
    const index = this.state.files.findIndex(fileObject => fileObject.metaData.name === imgName);
    if (index !== -1) {
      const newFiles = update(this.state.files, {
        [index]: {
          metaData: { $merge:
            { name: nameInput.lastIndexOf('.') !== -1
              ? nameInput.substring(0, nameInput.lastIndexOf('.')).concat('.', oldExt)
            : nameInput.concat('.', oldExt) },
          },
        },
      });
      this.safeSetState({
        files: newFiles,
      });
    }
    this.safeSetState({
      wrongExtension: newExt !== undefined && newExt !== oldExt,
      changeNameOpen: false,
      attemptedExt: newExt,
      nameInput: '',
      newExt: '',
    });
  }

  changeImageNameClose() {
    this.safeSetState({ changeNameOpen: false });
  }

  postUploadReset() {
    this.safeSetState({
      files: [],
      uploading: false,
    });
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={this.changeImageNameClose}
      />,
      <FlatButton
        label="Submit"
        primary
        onClick={this.changeImageName}
      />,
    ];
    const changedStateStyle = {};
    changedStateStyle.fontWeight = 'normal';
    if (!this.state.changed) {
      if (!this.state.uploading) {
        changedStateStyle.display = 'none';
      } else {
        changedStateStyle.display = 'block';
        changedStateStyle.color = '#65e765';
      }
    } else {
      if (!this.state.uploading) {
        changedStateStyle.display = 'block';
        changedStateStyle.color = '#6490e7';
      } else {
        changedStateStyle.display = 'block';
        changedStateStyle.color = '#6490e7';
      }
    }

    const imagePreviews = this.state.files ? this.state.files.map((fileObject) => {
      const { name, url, uploadStatus, amazonURL, errorMessage } = fileObject.metaData;
      return (
        <ImagePreview
          url={url}
          name={name}
          uploadStatus={uploadStatus}
          key={name}
          onDelete={this.deleteImagePreview}
          onChangeName={this.changeImageName}
          onChangeNameOpen={this.changeImageNameOpen}
          amazonURL={amazonURL}
          errorMessage={errorMessage}
        />);
    }) : null;

    const isUpload = /upload\/?$/.test(window.location.pathname);

    const styles = {
      button: {
        margin: 12,
      },
      exampleImageInput: {
        cursor: 'pointer',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        width: '100%',
        opacity: 0,
      },
      paper: {
        height: '100%',
        width: '100%',
        minWidth: '400px',
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'center',
        display: 'inline-block',
        paddingBottom: 10,
      },
      imageInput: {
        display: 'none',
      },
      uploadButtons: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      raisedButton: {
        color: 'white',
        marginRight: '0.5rem',
      },
      buttonText: {
        margin: '0rem 0.3rem',
      },
      imageSubmit: {
        marginBottom: 30,
      },
      heading: {
        fontFamily: 'Roboto',
      },
    };

    let extensionErrorMsg = `To change the image's extension to . ${this.state.attemptedExt},`;
    extensionErrorMsg = extensionErrorMsg.concat(' please convert it externally and re-upload.');

    return (
      <div>
        <h1 style={styles.heading}>Images</h1>
        <Divider />
        <Paper style={styles.paper} zDepth={2} >
          <form
            style={styles.imageSubmit}
            onSubmit={this.handleUpload}
          >
            <Tabs>
              <Tab
                icon={<FileUpload />}
                label="UPLOAD"
                containerElement={<Link to="/images/upload" />}
              />
              <Tab
                icon={<Folder />}
                label="ARCHIVES"
                containerElement={<Link to="/images/archive" />}
              />
            </Tabs>
            <div>
              {isUpload ?
                <div style={styles.uploadButtons}>
                  <FlatButton
                    label="Add an Image"
                    labelPosition="before"
                    style={styles.button}
                    containerElement="label"
                    backgroundColor="#b5effc"
                    hoverColor="#f4f7f9"
                    disabled={this.state.uploading}
                  >
                    <input
                      type="file"
                      name="file-selector"
                      accept="image/*"
                      onChange={this.handleInputChange}
                      disabled={this.state.uploading}
                      style={styles.imageInput}
                      multiple
                    />
                  </FlatButton>
                  <RaisedButton
                    primary
                    type="submit"
                    disabled={this.state.uploading || !this.state.changed}
                    style={styles.raisedButton}
                  >
                    <p style={styles.buttonText}>UPLOAD</p>
                  </RaisedButton>
                  {this.state.uploading && !this.state.changed ?
                    <RaisedButton
                      onClick={this.postUploadReset}
                      secondary
                      style={styles.raisedButton}
                    ><p style={styles.buttonText}>NEW UPLOAD</p></RaisedButton>
                  : null
                  }
                </div>
              : null}
            </div>
            <div>
              {isUpload
                ? React.cloneElement(this.props.children,
                  {
                    images: imagePreviews,
                    onChange: this.handlePreviewChange,
                  })
                : this.props.children
              }
            </div>
          </form>
        </Paper>
        <Dialog
          title="Change Image Name"
          actions={actions}
          modal
          open={this.state.changeNameOpen}
        >
          Please enter a new name for the image:
          <br />
          <form onSubmit={this.changeImageName}>
            <TextField
              name="newName"
              fullWidth={this.state.fullWidthTextField}
              defaultValue={this.state.nameInput}
              onChange={this.fieldUpdaters.nameInput}
            />
          </form>
        </Dialog>
        <Snackbar
          open={this.state.wrongExtension}
          message={extensionErrorMsg}
          autoHideDuration={6000}
          onRequestClose={this.handleSnackbarClose}
        />
      </div>
    );
  }
}
