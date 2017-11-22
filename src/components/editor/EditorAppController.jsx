import React from 'react';
import BaseComponent from 'lib/BaseComponent';
import { browserHistory } from 'react-router';
import http from 'http';

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
import EditorNavigation from 'components/editor/EditorNavigation';

// Custom utilities
import { updateFieldValue } from './lib/form-field-updaters';

export default class EditorAppController extends BaseComponent {
  constructor(props) {
    super(props);
    this.restartServer = this.restartServer.bind(this);
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
    function isRestarted() {
      http.get('/isrestarted', (response) => {
        let signal = '';
        response.on('data', (chunk) => {
          signal += chunk;
        });
        response.on('end', () => {
          if (signal === 'false') {
            window.alert('Servers restarted successfully');
          } else if (signal === 'true') {
            counter += 1;
            if (counter <= 5) {
              setTimeout(isRestarted, 500);
            }
          }
          if (counter > 5) {
            window.alert('Error');
          }
        });
      });
    }
    isRestarted();
  }

  restartServer() {
    const password = this.state.restartPasswordValue;
    this.safeSetState({
      restartPasswordValue: '',
    });
    http.get(`/restartserver?password=${password}`, (res) => {
      let reply = '';

      res.on('data', (chunk) => {
        reply += chunk;
      });

      res.on('end', () => {
        if (reply === 'start') {
          window.alert('Server is being restarted now');
          this.safeSetState({
            restartPasswordModalOpen: false,
          });
          this.pingServer();
        } else if (reply === 'error') {
          window.alert('There was an error restarting the servers');
        } else if (reply === 'invalid') {
          window.alert('Invalid password');
          // Put focus back on password element for good UX
          this.refs.passwordInput.focus();
        } else {
          window.alert('unknown error');
        }
      });
    });
  }

  resetGhostInfo() {
    this.props.model.invalidate(['articles', 'byPage'], ['articles', 'bySlug']);
    browserHistory.push('/');
  }

  signOut() {
    browserHistory.push('/login');
  }

  toggleRestartPasswordModal() {
    this.safeSetState(prevState => ({
      restartPasswordModalOpen: !prevState.restartPasswordModalOpen,
    }));
  }

  handleRestartPasswordEnter(e) {
    if (e.key === 'Enter') {
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
            title={"Editor Tools"}
            iconElementRight={this.isLoggedIn() ?
              <LoggedIn /> :
              <FlatButton label="Sign In" />}
            showMenuIconButton={false}
          />

          {/* Only show nav if logged in */}
          <EditorNavigation isNavOpen={this.isLoggedIn()} />
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
                label="Cancel"
                onClick={this.toggleRestartPasswordModal}
              />,
              <FlatButton
                label="Submit"
                onClick={this.restartServer}
              />,
            ]}
          >
            <TextField
              ref={this.assignPasswordRef}
              value={this.state.restartPasswordValue}
              floatingLabelText="Input Password"
              type="password"
              onChange={this.fieldUpdaters.restartPassword}
              onKeyUp={this.handleRestartPasswordEnter}
              autoFocus
            />
          </Dialog>
        </div>
      </MuiThemeProvider>
    );
  }
}
