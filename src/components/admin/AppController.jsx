import React from 'react';
import BaseComponent from 'lib/BaseComponent';
import { browserHistory } from 'react-router';

// material-ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

// Components
import Navigation from 'components/admin/Navigation';

// Custom utilities
import { updateFieldValue } from './lib/form-field-updaters';
import { isCI } from 'lib/utilities';

export default class AppController extends BaseComponent {
  constructor(props) {
    super(props);
    this.restartServer = this.restartServer.bind(this);
    this.pingServer = this.pingServer.bind(this);
    this.handleDisableLink = this.handleDisableLink.bind(this);
    this.resetGhostInfo = this.resetGhostInfo.bind(this);
    this.isLoggedIn = this.isLoggedIn.bind(this);
    this.toggleRestartPasswordModal = this.toggleRestartPasswordModal.bind(this);
    this.handleRestartPasswordEnter = this.handleRestartPasswordEnter.bind(this);
    this.assignPasswordRef = ref => {
      this.refs = { passwordInput: ref };
    };
    this.fieldUpdaters = {
      restartPassword: updateFieldValue.bind(this, 'restartPasswordValue', undefined),
    };
    this.safeSetState({
      restartPasswordModalOpen: false,
      restartPasswordValue: '',
      currentlyRestarting: false,
    });
  }

  componentWillMount() {
    // Used for material-ui magic;
    injectTapEventPlugin(); // Will be removed when React supports onTouchTap() soon
  }

  isLoggedIn() {
    return this.props.location.pathname.substr(0, 6) !== '/login';
  }

  handleDisableLink(e) {
    if (!this.isLoggedIn()) {
      e.preventDefault();
    }
  }

  pingServer() {
    let counter = 0;
    // The function below is a closure that will be able to access the counter variable above
    // across several calls
    const isRestarted = () => {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        let failed = false;
        try {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            // Request is done
            const signal = xhr.responseText;
            if (signal === 'false' && xhr.status === 200) {
              window.alert('Server restarted successfully');
              this.safeSetState({
                restartPasswordModalOpen: false,
                currentlyRestarting: false,
              });
            } else {
              failed = true;
            }
          }
        } catch (e) {
          // This means there was an error in communication
          failed = true;
        }
        if (failed) {
          // If it fails in any way including unexpected status codes or communication crash
          // we just try again
          counter += 1;
          if (counter <= 5) {
            setTimeout(isRestarted, 500);
          } else {
            window.alert(
              "Timeout: Server still hasn't restarted, please contact dev team for assistance"
            );
            this.safeSetState({ currentlyRestarting: false });
          }
        }
      };
      xhr.open('GET', '/is-restarted', true);
      xhr.send();
    };
    isRestarted();
  }

  restartServer() {
    const password = this.state.restartPasswordValue;
    this.safeSetState({
      restartPasswordValue: '',
      currentlyRestarting: true,
    });
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      let failed = false;
      try {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          // Request is done
          if (xhr.status === 200) {
            window.alert('Server is being restarted now');
            this.pingServer();
          } else if (xhr.status === 401) {
            window.alert('Invalid password');
            this.safeSetState({ currentlyRestarting: false });
            // Put focus back on password element for good UX
            this.refs.passwordInput.focus();
          } else {
            // Unexpected behaviour
            failed = true;
          }
        }
      } catch (e) {
        // This means there was an error in communication
        failed = true;
      }
      if (failed) {
        window.alert('Unexpected error while trying to restart server, please contact dev team');
        this.safeSetState({
          currentlyRestarting: false,
        });
      }
    };
    xhr.open('POST', '/restart-server', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ password }));
  }

  resetGhostInfo() {
    this.props.model.invalidate(['articles', 'byPage'], ['articles', 'bySlug']);
    browserHistory.push('/');
  }

  signOut() {
    // if CI, just blindly redirect
    if (isCI) {
      browserHistory.push('/login');
    }
    if (window.THE_GAZELLE.googleAPILoaded) {
      if (!window.gapi.auth2) {
        alert('(Dev Mode) Cannot sign out before sign in. Visit /login first.');
      } else {
        const auth = window.gapi.auth2.getAuthInstance();
        auth.signOut().then(() => {
          // revokes all of the scopes that the user granted
          auth.disconnect();
          browserHistory.push('/login');
        });
      }
    }
  }

  toggleRestartPasswordModal() {
    this.safeSetState(prevState => ({
      restartPasswordModalOpen: !prevState.restartPasswordModalOpen,
    }));
  }

  handleRestartPasswordEnter(e) {
    if (e.key === 'Enter' && !this.state.currentlyRestarting) {
      this.restartServer();
    }
  }

  render() {
    const bodyStyle = { transition: 'margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)' };
    const APP_ID = 'app';
    const HEADER_ID = `${APP_ID}-header`;
    if (this.isLoggedIn()) { bodyStyle.marginLeft = 256; }

    const LoggedIn = () => (
      <IconMenu
        iconButtonElement={
          <IconButton id={`${HEADER_ID}-menu-button`}><MoreVertIcon /></IconButton>
        }
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem
          id={`${HEADER_ID}-restart-button`}
          primaryText="Restart Server"
          onClick={this.toggleRestartPasswordModal}
          style={{ color: '#C62828' }}
        />
        <MenuItem
          id={`${HEADER_ID}-refresh-ghost-button`}
          primaryText="Refresh Ghost Data"
          onClick={this.resetGhostInfo}
          disabled
        />
        <Divider />
        <MenuItem
          id={`${HEADER_ID}-sign-out-button`}
          primaryText="Sign out"
          onClick={this.signOut}
        />
      </IconMenu>
    );

    return (
      <MuiThemeProvider>
        <div id={APP_ID} className="mainContainer">
          <AppBar
            id={HEADER_ID}
            title={"Admin Interface"}
            iconElementRight={this.isLoggedIn() ?
              <LoggedIn /> :
              null}
            showMenuIconButton={false}
          />

          {/* Only show nav if logged in */}
          <Navigation isNavOpen={this.isLoggedIn()} />
          <div style={bodyStyle} className="editor-body">
            <div className="editor-items">
              {this.props.children}
            </div>
          </div>
          {/* Dialog for restart server password */}
          <Dialog
            title="Restart Server"
            modal
            open={this.state.restartPasswordModalOpen}
            actions={[
              <FlatButton
                id="restart-server-password-cancel"
                label="Cancel"
                onClick={this.toggleRestartPasswordModal}
              />,
              <FlatButton
                label="Submit"
                id="restart-server-password-submit"
                onClick={this.restartServer}
                disabled={this.state.currentlyRestarting}
              />,
            ]}
          >
            <TextField
              ref={this.assignPasswordRef}
              value={this.state.restartPasswordValue}
              floatingLabelText="Input Password"
              id="restart-server-password-input"
              type="password"
              onChange={this.fieldUpdaters.restartPassword}
              onKeyUp={this.handleRestartPasswordEnter}
              disabled={this.state.currentlyRestarting}
              autoFocus
            />
          </Dialog>
        </div>
      </MuiThemeProvider>
    );
  }
}
