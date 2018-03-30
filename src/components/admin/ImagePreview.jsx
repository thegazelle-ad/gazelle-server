import React from 'react';
import BaseComponent from 'lib/BaseComponent';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import Snackbar from 'material-ui/Snackbar';

/* uploadStatus prop is encoded as such:
  1: Upload in progress,
  2: Upload complete,
  3: Upload error / failed,
  else: No upload attempted yet
  */
export default class ImagePreview extends BaseComponent {
  constructor() {
    super();
    this.safeSetState({
      open: false,
    });

    this.onDelete = this.onDelete.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeNameOpen = this.onChangeNameOpen.bind(this);
    this.onCopyToClipboard = this.onCopyToClipboard.bind(this);
  }

  onDelete() {
    this.props.onDelete(this.props.name);
  }

  onChangeName() {
    this.props.onChangeName();
  }

  onChangeNameOpen() {
    this.props.onChangeNameOpen(this.props.name);
  }

  onCopyToClipboard() {
    const textField = document.createElement('textarea');
    textField.innerText = this.props.amazonURL;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    this.safeSetState({ open: true });
    textField.remove();
  }

  render() {
    const styles = {
      flatButton: {
        margin: '0.2rem',
        fontSize: '0.8rem',
      },
      loading: {
        opacity: '0.5',
      },
      greenText: {
        color: '#34d15e',
      },
      redText: {
        color: '#e53939',
      },
      imagePreview: {
        position: 'relative',
        background: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderRadius: '2px',
        overflowWrap: 'break-word',
        height: '50%',
        width: '30%',
        margin: '10px',
      },
      imageThumbnail: {
        width: '100%',
        height: '50%',
      },
      cardText: {
        padding: '0.8rem',
      },
      hr: {
        border: '0.5px solid rgba(0,0,0,0.3)',
      },
      copyLink: {
        marginTop: '0.3rem',
      },
      previewError: {
        color: 'red',
      },
    };

    const { url, name, uploadStatus, amazonURL, errorMessage } = this.props;
    let uploadingComponent;
    if (uploadStatus === 1) {
      uploadingComponent = <CircularProgress />;
    } else if (uploadStatus === 2) {
      uploadingComponent = (
        <div style={styles.greenText}>
          <hr style={styles.hr} />
          Uploaded at {amazonURL}
          <br />
        </div>
      );
    } else if (uploadStatus === 3) {
      uploadingComponent = (
        <div style={styles.redText}>
          <hr style={styles.hr} />
          Upload Failed
        </div>
      );
    } else {
      uploadingComponent = null;
    }

    let messageComponent;
    let copyComponent = null;
    if (amazonURL) {
      if (document.queryCommandSupported('copy')) {
        copyComponent = (
          <FlatButton
            backgroundColor="#f9f9f9"
            style={styles.copyLink}
            onClick={this.onCopyToClipboard}
          >
            COPY LINK
          </FlatButton>
        );
      } else {
        // TODO: After Material-UI is merged in we change this to a
        // Material-UI Dialog or something similar
        copyComponent = (
          <div>
            It seems that our copy button is not compatible with your web
            browser. Please upgrade to the newest version for full Gazelle
            capabilities.
          </div>
        );
      }
    } else if (errorMessage) {
      messageComponent = (
        <div style={styles.previewError}>Error: {errorMessage}</div>
      );
    } else {
      messageComponent = null;
    }

    let component;
    if (url) {
      component = (
        <div className="imagePreview" style={styles.imagePreview}>
          <img
            alt={`preview of ${name}`}
            src={url}
            style={styles.imageThumbnail}
          />
          <div style={styles.cardText}>
            {name}
            <br />
            <FlatButton
              type="button"
              secondary
              onClick={this.onDelete}
              style={styles.flatButton}
            >
              DELETE
            </FlatButton>
            <FlatButton
              type="button"
              onClick={this.onChangeNameOpen}
              style={styles.flatButton}
            >
              CHANGE NAME
            </FlatButton>
            <br />
            {uploadingComponent}
            {messageComponent}
            {copyComponent}
          </div>
          <Snackbar
            open={this.state.open}
            message="Link copied to clipboard"
            autoHideDuration={4000}
            onActionTouchTap={this.handleActionTouchTap}
            onRequestClose={this.handleRequestClose}
          />
        </div>
      );
    } else {
      component = <CircularProgress />;
    }

    return component;
  }
}

ImagePreview.propTypes = {
  url: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  uploadStatus: React.PropTypes.number,
  amazonURL: React.PropTypes.string,
  errorMessage: React.PropTypes.string,
  onDelete: React.PropTypes.func.isRequired,
  onChangeName: React.PropTypes.func.isRequired,
};
