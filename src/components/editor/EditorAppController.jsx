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

// Components
import EditorNavigation from 'components/editor/EditorNavigation';

const HOSTNAME = process.env.NODE_ENV === "production" ?
  "admin.thegazelle.org" : process.env.NODE_ENV === "beta" ?
  "adminbeta.thegazelle.org" : "localhost";
const PORT = process.env.NODE_ENV === "production" ?
  443 : process.env.NODE_ENV === "beta" ?
  443 : 4000;

export default class EditorAppController extends BaseComponent {
  constructor(props) {
    super(props);
    this.handleDisableLink = this.handleDisableLink.bind(this);
    this.resetGhostInfo = this.resetGhostInfo.bind(this);
    this.state = {isLoggedIn: true}; // TODO: change to false when log in works
  }

  componentWillMount() {
    // Used for material-ui magic;
    injectTapEventPlugin(); // Will be removed when React supports onTouchTap() soon
  }

  handleDisableLink(e) {
    if (this.props.location.pathname === "/login") {
      e.preventDefault();
    }
  }

  restartServer() {
    const password = window.prompt("Please input the password");
    const options = {
      hostname: HOSTNAME,
      port: PORT,
      path: '/restartserver?password=' + password,
    }
    http.get(options, (res) => {
      let reply = '';

      res.on('data', (chunk) => {
        reply += chunk;
      });

      res.on('end', () => {
        if (reply === "restarted") {
          window.alert("Servers restarted successfully");
        }
        else if (reply === "error") {
          window.alert("there was an error restarting the servers");
        }
        else if (reply === "invalid") {
          window.alert("invalid password");
        }
        else {
          window.alert("unknown error");
        }
      });
    });
  }

  resetGhostInfo() {
    this.props.model.invalidate(['articlesByPage'], ['articlesBySlug']);
    browserHistory.push('/');
  }

  render() {
    const navItems = ["Articles", "Authors", "Issues", "Images"];
    const bodyStyle = { transition: 'margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)' };
    if (this.state.isLoggedIn) { bodyStyle.marginLeft = 256; }

    this.props.location.pathname === "/login" ?
      this.state.isLoggedIn == false : this.state.isLoggedIn == true;

    const LoggedIn = () => {
      return (
        <IconMenu
          iconButtonElement={
            <IconButton><MoreVertIcon /></IconButton>
          }
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
          <MenuItem
            primaryText="Restart Server"
            onClick={this.restartServer}
            style={{color: '#C62828'}}
          />
          <MenuItem
            primaryText="Refresh Ghost Data"
            onClick={this.resetGhostInfo}
            disabled
          />
          <MenuItem primaryText="Sign out" />
        </IconMenu>
      );
    }

    return (
      <MuiThemeProvider>
        <div className="mainContainer">
          {/* TODO: Make isLoggedIn work */}
          <AppBar
            title={"Editor Tools"}
            iconElementRight={this.state.isLoggedIn ?
              <LoggedIn /> :
              <FlatButton label="Sign In" />}
            showMenuIconButton={false}
          />

          {/* Only show nav on login */}
          <EditorNavigation navItems={navItems} isNavOpen={this.state.isLoggedIn} />
          <div style={bodyStyle} className="editor-body">
            <div className="editor-items">
              {this.props.children}
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}
